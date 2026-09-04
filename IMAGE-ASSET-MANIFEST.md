# Sukuu ERP image asset manifest

The website uses six built-in, AI-generated editorial images. They are designed as a coherent Ghanaian private basic-school campaign spanning lower primary through junior high school. No external image host or runtime image dependency is required.

## Visual direction

- Ghanaian private-school environment and architecture
- Ghanaian pupils, families, teachers and school leaders
- Coordinated cream, navy and gold uniform styling without third-party marks
- Lower-primary and junior-high age representation
- Documentary editorial photography with warm Ghana daylight
- No readable school names, copied logos or interface text

## Files and placement

| File | Story | Website placement |
|---|---|---|
| `assets/images/ghana-school-leadership.webp` | School leaders walking through a private basic-school campus with primary and JHS pupils | Hero slideshow |
| `assets/images/ghana-classroom-learning.webp` | Lower-primary teaching and classroom participation | Hero slideshow |
| `assets/images/ghana-family-engagement.webp` | Parent and lower-primary learner reviewing a school update | Hero slideshow |
| `assets/images/ghana-school-administration.webp` | Headteacher and administrator reviewing institutional records | Connected-school slideshow |
| `assets/images/ghana-science-learning.webp` | JHS pupils completing a supervised STEM activity | Connected-school slideshow |
| `assets/images/ghana-school-operations.webp` | Lower-primary and JHS pupils arriving at a private basic school | Connected-school slideshow |

## Production notes

The source compositions were generated specifically for this website, cropped to a consistent 16:9 frame and exported as optimised 1600 × 900 WebP assets. Descriptive alternative text is supplied in `index.html`. The standalone builder embeds the final WebP files as data URLs.

## Social share image

`assets/social/sukuu-social-share-1200x630.jpg` (1200 × 630, progressive JPEG, ~132KB) is a composite built from `ghana-classroom-learning.webp` — cover-cropped, with a navy gradient scrim for text legibility, the brand mark, "SUKUU ERP / SCHOOLS OPERATING SYSTEM" lockup, and the "Better schools. Closer families. Stronger learners." headline overlaid. Used for `og:image` and `twitter:image`. Exported as JPEG rather than PNG since photographic content compresses far more efficiently as JPEG (this file was originally a 676KB PNG of the same composite).
