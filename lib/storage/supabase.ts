import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const portfolioThumbnailBucket = process.env.SUPABASE_PORTFOLIO_THUMBNAIL_BUCKET ?? "portfolio-thumbnails";
const skillIconBucket = process.env.SUPABASE_SKILLS_ICONS_BUCKET ?? "skills-icon";
const experienceImagesBucket = process.env.SUPABASE_EXPERIENCE_IMAGES_BUCKET ?? "experience-images";
const settingsAssetsBucket = process.env.SUPABASE_SETTINGS_ASSETS_BUCKET ?? "settings-assets";

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}

export const supabaseStorage = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export { portfolioThumbnailBucket, skillIconBucket, experienceImagesBucket, settingsAssetsBucket };