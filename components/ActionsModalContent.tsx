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
import { updateFileUsers } from "@/lib/actions/file.actions";

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
  const [email, setEmail] = useState("");
  const path = usePathname();

  const handleShare = async () => {
    // Correctly call the server action with the necessary parameters.
    await updateFileUsers({
      fileId: file.$id,
      emails: [...file.users, email],
      path,
    });
    // Clear the input field after a successful share.
    setEmail("");
  };

  const handleRemove = async (emailToRemove: string) => {
    // Correctly call the server action to remove a user.
    const updatedEmails = file.users.filter((e: string) => e !== emailToRemove);
    await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="share-input-field"
          />
          <Button onClick={handleShare} className="share-button">
            Share
          </Button>
        </div>
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>
          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => handleRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
