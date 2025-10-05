import React from "react";
import Link from "next/link";
import { Models } from "node-appwrite";

import { convertFileSize } from "@/lib/utils";
import ActionDropdown from "@/components/ActionDropdown";
import { Thumbnail } from "@/components/Thumbnail";
import { FormattedDateTime } from "@/components/FormattedDateTime";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <div className="card">
      <Link href={file.url} target="_blank" className="card-link">
        <div className="card-content">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="size-16"
          />
          <div className="card-details">
            <h5 className="card-name">{file.name}</h5>
            <div className="card-meta">
              {file.owner?.fullName && (
                <p className="subtitle-2 capitalize">{file.owner.fullName}</p>
              )}
              <FormattedDateTime date={file.$updatedAt} className="caption" />
            </div>
          </div>
        </div>
      </Link>
      <div className="card-footer">
        <p className="subtitle-2 text-right">{convertFileSize(file.size)}</p>
        <ActionDropdown file={file} />
      </div>
    </div>
  );
};

export default Card;
