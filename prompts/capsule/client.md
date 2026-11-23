## Landing Page

### Shepherd landing page

I used the dictionary sense of the word as the design spine. A shepherd tends a flock, watches through the night, guides the strays, and leads to good pasture. Each of those became a section.

| Shepherd idea                 | Section                                               | Data source                         |
| ----------------------------- | ----------------------------------------------------- | ----------------------------------- |
| Keeps watch through the night | The Night Watch: live countdowns to upcoming episodes | next_air_schedule_time, next_air_ep |
| Tends the flock               | The Flock: recently updated titles                    | /anime/recent                       |
| Leads to pasture              | Pastures: genre filter over the flock                 | terms_by_type.genre                 |
| Guides the stray              | Send me a stray: a random pick button                 | client-side                         |
| Counts the sheep              | The hero counter                                      | meta.total                          |

### Where this could go next

A /anime/airing endpoint (filter by next_air_schedule_time) would give the Night Watch a proper week-long schedule, grouped by day.
A /anime/genres endpoint would turn Pastures into real routes (/pasture/fantasy) rather than a client-side filter.
A "Your flock" watchlist built from localStorage would be the natural payoff of the name: the shepherd remembers what you were following.
The real reason behind the name may turn out to be more personal than the dictionary. Once you find it, the hero copy is the one place to change.

---
