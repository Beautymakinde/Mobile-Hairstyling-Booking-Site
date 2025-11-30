import { supabase } from './client'

const BUCKET_NAME = 'booking-receipts'
const SERVICES_BUCKET = 'service-images'

export const storageQueries = {
  // Initialize bucket (run once during setup)
  async initializeBucket(): Promise<void> {
    try {
      // Try to get bucket info - if it fails, bucket doesn't exist
      await supabase.storage.getBucket(BUCKET_NAME)
    } catch (error) {
      // Create bucket if it doesn't exist
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      })
    }
  },

  // Initialize services bucket
  async initializeServicesBucket(): Promise<void> {
    try {
      await supabase.storage.getBucket(SERVICES_BUCKET)
    } catch (error) {
      await supabase.storage.createBucket(SERVICES_BUCKET, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      })
    }
  },

  // Upload service image
  async uploadServiceImage(
    serviceId: string,
    file: File
  ): Promise<{ path: string; url: string }> {
    if (!file) throw new Error('No file provided')
    if (file.size > 5242880) throw new Error('File size exceeds 5MB limit')

    const fileExt = file.name.split('.').pop()
    const fileName = `${serviceId}-${Date.now()}.${fileExt}`
    const filePath = `services/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(SERVICES_BUCKET)
      .upload(filePath, file, { upsert: false })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(SERVICES_BUCKET).getPublicUrl(filePath)

    return {
      path: filePath,
      url: data.publicUrl,
    }
  },

  // Delete service image
  async deleteServiceImage(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(SERVICES_BUCKET)
      .remove([filePath])

    if (error) throw error
  },

  // Upload receipt image
  async uploadReceipt(
    bookingId: string,
    file: File
  ): Promise<{ path: string; url: string }> {
    if (!file) throw new Error('No file provided')
    if (file.size > 5242880) throw new Error('File size exceeds 5MB limit')

    const fileExt = file.name.split('.').pop()
    const fileName = `${bookingId}-${Date.now()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { upsert: false })

    if (uploadError) throw uploadError

    // Get public URL
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return {
      path: filePath,
      url: data.publicUrl,
    }
  },

  // Get receipt URL
  async getReceiptUrl(filePath: string): Promise<string> {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    return data.publicUrl
  },

  // Delete receipt
  async deleteReceipt(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw error
  },
}
