// sanity/schemaTypes/index.ts
//
// Every schema you create needs to be added to this array.
// sanity.config.ts imports this and registers them all
// with the studio. If you create a new schema and forget
// to add it here, it won't appear in the studio.

import { serviceSchema      } from "./service";
import { caseStudySchema    } from "./caseStudy";
import { authorSchema       } from "./author";
import { siteSettingsSchema } from "./siteSettings";
import { aboutPageSchema    } from "./aboutPage";
import { faqItemSchema      } from "./faq";
import { postSchema         } from "./post";
import { blogPageSchema     } from "./blogPage";
import { homePageSchema     } from "./homePage";
import { servicesPageSchema } from "./servicesPage";
import { contactPageSchema  } from "./contactPage";
import { seoSchema          } from "./objects/seo";
import { faqBlockSchema     } from "./objects/faqBlock";

export const schemaTypes = [
  serviceSchema,
  caseStudySchema,
  authorSchema,
  siteSettingsSchema,
  aboutPageSchema,
  faqItemSchema,
  postSchema,
  blogPageSchema,
  homePageSchema,
  servicesPageSchema,
  contactPageSchema,
  seoSchema,
  faqBlockSchema,
];