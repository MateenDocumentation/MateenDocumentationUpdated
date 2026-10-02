export type InquiryPayload = {
  type: 'contact' | 'order';
  fields: Record<string, string>;
  attachment?: {
    name: string;
    type: string;
    content: string;
  };
};

export async function fileToAttachment(file: File) {
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.readAsDataURL(file);
  });

  return { name: file.name, type: file.type || 'application/octet-stream', content };
}

export async function submitInquiry(payload: InquiryPayload) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || 'We could not submit your request. Please try again.');
  }
}
