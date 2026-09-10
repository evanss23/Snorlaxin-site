import { Trash2 } from "lucide-react";
import { deleteGalleryAction, updateCaptionAction } from "@/app/actions/gallery";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { formatDate } from "@/lib/format";
import { listGallery } from "@/lib/queries";

export default function AdminGallery() {
  const images = listGallery();
  return (
    <>
      <AdminHeader title="Gallery" body={`${images.length} photos on the wall. Anything you add shows up on the public gallery instantly.`} />
      <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <div className="xl:sticky xl:top-28 xl:self-start">
          <GalleryUploadForm />
        </div>
        {images.length === 0 ? (
          <div className="card grid place-items-center px-6 py-20 text-center text-muted">Upload your first photos to get started.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
            {images.map((img) => (
              <li key={img.id} className="card overflow-hidden p-2">
                <div className="aspect-square overflow-hidden rounded-2xl bg-cream-200 dark:bg-snorlax-800">
                  <img src={img.path} alt={img.caption} className="h-full w-full object-cover" />
                </div>
                <form action={updateCaptionAction} className="mt-2 flex gap-1.5">
                  <input type="hidden" name="id" value={img.id} />
                  <input name="caption" defaultValue={img.caption} placeholder="Add a caption" className="field min-w-0 flex-1 px-3 py-1.5 text-sm" />
                  <button className="btn btn-secondary btn-sm px-3">Save</button>
                </form>
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-muted">
                  <span className="truncate">
                    {img.uploader_name ?? "Team"} · {formatDate(img.created_at)}
                  </span>
                  <form action={deleteGalleryAction}>
                    <input type="hidden" name="id" value={img.id} />
                    <ConfirmButton message="Remove this photo from the gallery?" className="grid h-8 w-8 place-items-center rounded-full hover:bg-berry-400/15 hover:text-berry-600">
                      <Trash2 size={14} />
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
