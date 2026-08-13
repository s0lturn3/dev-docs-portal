type AttachmentModel = {
  id: number;
  page_id: number;
  file_name: string;
  stored_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: number;
  created_at: Date;
};

export default AttachmentModel;