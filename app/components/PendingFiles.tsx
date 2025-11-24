// app/components/PendingFiles.tsx
import React from "react";

type PendingFilesProps = {
  pendingFiles: File[];
};

const PendingFiles: React.FC<PendingFilesProps> = ({ pendingFiles }) => (
  <div>
    <h4>Pending Files:</h4>
    <ul>
      {pendingFiles.map((file, index) => (
        <li key={index}>{file.name}</li>
      ))}
    </ul>
  </div>
);

export default PendingFiles;
