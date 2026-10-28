# v26 design references and implementation boundaries

Research checked 28 October 2026.

South Coast Plaza’s own concierge page describes multiple central service locations, package check, restaurant assistance and a personal stylist program. This supports giving the game’s existing concierge counter and outfit planning a larger role in a shopping day. [South Coast Plaza concierge](https://www.southcoastplaza.com/concierge/).

Irvine Spectrum Center describes guest services alongside retail, dining and attractions. Its amenities page includes directory help and lost-and-found assistance. These references support a center with useful stops and time between shops. [Guest services](https://www.irvinespectrumcenter.com/guest-services), [center amenities](https://www.irvinespectrumcenter.com/guest-services/services).

Noor, Jules, their conversations, chapter choices, the concierge guestbook and the furnished collection room are original game designs. Their costs, rewards, schedules and layouts are game rules. Existing catalog model identities, photographs and price references remain unchanged.

The implementation reuses the retained anatomical model, product meshes, skeleton, fit envelope and asset notices. Starter sleeves use material groups on the original arm surface, preserving the skinning and avoiding duplicate body geometry. The collection room uses original primitive geometry, the existing lights and a fixed camera; it loads only the player’s available displayed purchases. Room changes dispose the previous preview through the existing view lifecycle.

Window-shopping targets retain a walkable doorway and a separate display-facing point. Actual displacement drives the gait, and the existing actor visibility range remains in use. Material changes use a fixed set of instanced buckets; they add no per-shop lights or per-frame textures. The current motion remains controlled animation. These adapted game scenes do not establish exact architectural or manufacturing fidelity.
