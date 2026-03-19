// sanity/schemaTypes/index.ts
//
// Every schema you create needs to be added to this array.
// sanity.config.ts imports this and registers them all
// with the studio. If you create a new schema and forget
// to add it here, it won't appear in the studio.

import { serviceSchema      } from "./service";
import { caseStudySchema    } from "./caseStudy";
import { siteSettingsSchema } from "./siteSettings";
import { aboutPageSchema    } from "./aboutPage";

export const schemaTypes = [
  serviceSchema,
  caseStudySchema,
  siteSettingsSchema,
  aboutPageSchema,
];