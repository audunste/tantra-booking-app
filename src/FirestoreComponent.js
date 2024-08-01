// src/FirestoreComponent.js
import React, { useEffect, useState } from 'react';
import { addDocument, getDocuments } from './firestoreService';

const FirestoreComponent = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await getDocuments('test-collection');
      setDocuments(docs);
    };
    fetchDocuments();
  }, []);

  const handleAddDocument = async () => {
    await addDocument('test-collection', { field: 'value' });
    const docs = await getDocuments('test-collection');
    setDocuments(docs);
  };

  return (
    <div>
      <h1>Firestore Documents</h1>
      <button onClick={handleAddDocument}>Add Document</button>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{JSON.stringify(doc)}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirestoreComponent;
