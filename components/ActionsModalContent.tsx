"use client";

import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

// ImageThumbnail is a presentational component, no changes needed.
const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

// DetailRow is a presentational component, no changes needed.
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

// FileDetails is a presentational component, no changes needed.
export const FileDetails = ({ file }: { file: Models.Document }) => {
  // We use file.owners[0] to display the owner's full name, as per the database schema.
  const ownerName = file.owners[0]?.fullName || "N/A";

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={ownerName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

// ShareInput is now a self-contained client component that handles its own state and server action calls.
export const ShareInput = ({ file }: { file: Models.Document }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">Shareable link</p>
        <div className="flex items-center gap-2">
          <Input
            value={file.url}
            readOnly
            className="share-input-field"
          />
          <Button onClick={handleCopy} className="share-button">
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </>
  );
};
