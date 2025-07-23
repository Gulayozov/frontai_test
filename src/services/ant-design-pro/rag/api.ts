//import { request } from '@umijs/max';

// /
//  * Upload a file to the backend
//  * @param file - File object to upload
//  */
// export async function uploadFile(file: File) {
//   const formData = new FormData();
//   formData.append('file', file);

//   return request('/upload-file/', {
//     method: 'POST',
//     data: formData,
//     requestType: 'form',
//   });
// }

// /
//  * Ask a question to the RAG model
//  * @param question - User's question
//  * @returns response with the answer
//  */
// export async function askQuestion(question: string): Promise<{ result: string }> {
//   return request('/query', {
//     method: 'POST',
//     data: { question },
//   });
// }

// /
//  * Trigger download of a file from S3 by object path
//  * @param objectName - Full path of file in the bucket
//  */
// export function downloadFile(objectName: string) {
//   const encoded = encodeURIComponent(objectName);
//   window.open(/download_file?object_name=${encoded}, '_blank');
// }

// /
//  * Get list of files in S3 bucket
//  * @returns array of file paths
//  */
// export async function listFiles(): Promise<{ files: string[] }> {
//   return request('/list_files', {
//     method: 'GET',
//   });
// }
