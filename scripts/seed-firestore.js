// scripts/seed-firestore.js
// Usage:
//   node scripts/seed-firestore.js --file db.json [--subcollections]
// For emulator testing:
//   $env:FIRESTORE_EMULATOR_HOST='localhost:8080'; node scripts/seed-firestore.js --file db.json

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { v7 } = require('uuid');

const argv = require('minimist')(process.argv.slice(2));

const filePath = argv.file || 'db.json';
const useSubcollections = argv.subcollections || false;
const serviceAccountPath = argv.key || process.env.GOOGLE_APPLICATION_CREDENTIALS || null;

async function initFirebase() {
  // If GOOGLE_APPLICATION_CREDENTIALS is set or serviceAccountPath exists, use it.
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    console.log('Initializing firebase-admin with service account:', serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(require(path.resolve(serviceAccountPath))),
    });
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('Connecting to Firestore emulator at', process.env.FIRESTORE_EMULATOR_HOST);
    // For emulator, provide a dummy project ID
    admin.initializeApp({
      projectId: process.env.GCLOUD_PROJECT || 'martas-appslab-quests',
    });
  } else {
    // Try ADC (gcloud auth application-default login)
    console.log('Initializing firebase-admin using Application Default Credentials (ADC)');
    admin.initializeApp();
  }
  return admin.firestore();
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

async function importCollection(db, collectionName, items) {
  console.log(`Importing collection "${collectionName}" (${items.length} docs)`);
  const batches = chunkArray(items, 500); // Firestore 500 writes per batch
  let created = 0;

  for (const batchItems of batches) {
    const batch = db.batch();
    for (const item of batchItems) {
      const id = item.id ? String(item.id) : v7();
      const docRef = db.collection(collectionName).doc(id);

      // Remove nested arrays if using subcollections option; keep the arrays otherwise.
      const data = { ...item };
      delete data.id;

      if (useSubcollections) {
        // find fields that are arrays of objects; remove them from data; they will be written as subcollections
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key]) && data[key].every(isPlainObject)) {
            delete data[key];
          }
        }
      }

      // Optionally add a createdAt server timestamp, but serverTimestamp requires Firestore server
      batch.set(docRef, data);
      created++;
    }
    await batch.commit();
  }
  console.log(`Created/updated ${created} documents in ${collectionName}`);
}

async function importSubcollections(db, collectionName, items) {
  // For each item, find array-of-object fields and write each object as a doc in a subcollection
  console.log(`Importing subcollections for "${collectionName}"`);
  for (const item of items) {
    const parentId = item.id ? String(item.id) : v7();
    for (const key of Object.keys(item)) {
      const value = item[key];
      if (Array.isArray(value) && value.every(isPlainObject)) {
        const subcol = db.collection(collectionName).doc(parentId).collection(key);
        const subBatches = chunkArray(value, 500);
        for (const subItems of subBatches) {
          const batch = db.batch();
          for (const subItem of subItems) {
            const subId = subItem.id ? String(subItem.id) : v7();
            const docRef = subcol.doc(subId);
            const docData = { ...subItem };
            delete docData.id;
            // attach a reference to parent if useful
            docData._parentId = parentId;
            batch.set(docRef, docData);
          }
          await batch.commit();
        }
      }
    }
  }
  console.log('Subcollections import complete');
}

async function run() {
  try {
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(1);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);

    const db = await initFirebase();

    // Top-level keys become top-level collections
    for (const [collectionName, value] of Object.entries(json)) {
      if (!Array.isArray(value)) {
        console.warn(`Skipping "${collectionName}" — expected an array of documents.`);
        continue;
      }

      await importCollection(db, collectionName, value);

      if (useSubcollections) {
        await importSubcollections(db, collectionName, value);
      }
    }

    console.log('Import finished.');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(2);
  }
}

run();