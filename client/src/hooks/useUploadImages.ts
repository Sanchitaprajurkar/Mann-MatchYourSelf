import { useMutation } from "@tanstack/react-query";
import { reviewApi } from "../api/reviewApi";

export function useUploadImages() {
  return useMutation({
    mutationFn: (files: File[]) => reviewApi.uploadImages(files),
  });
}
