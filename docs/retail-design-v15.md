# Mallside v15 retail design

This release improves brand recognition and the physical shopping flow. It does not expand or replace the verified v12 catalog, change prices or promise current stock at a real branch.

## Storefronts

`retail-identity.js` gives familiar retailers explicit typography, casing, panel colors and fixture families, retaining the exact merchant name for other branches. Text is original code-drawn game art, not a licensed logo asset. All merchant sign palettes meet a 4.5:1 contrast check. This corrects the previous identical foreground/background colors on several familiar signs. Physical fascia signs remain visible independently of the nearby floating-label budget.

The façade has a recessed window pocket, side display bays, piers, a cornice and a central door. Display pedestals and substantial window furniture stay within the existing solid building footprint. Window photographs come only from that store's active photographed assortment, rotate daily, and never borrow another merchant's stock. Pending collections have no invented merchandise fallback.

## Interior treatments

Store profiles combine the existing distinct layouts with signature display features: sport shoe shelves and track markings, folded apparel, beauty mirrors, demonstration walls, sewing machines, bag niches, jewelry pads, pendants or linear lighting. Signature furniture occupies the existing reserved fixture areas so the collision and service routes remain valid. Real merchandise uses the existing locally hosted photographs; decorative mannequins, racks and equipment remain stylized game art.

Primary references consulted October 27, 2026:

- [Prada Group retail stories](https://www.pradagroup.com/en/group/remix-retailstories.html): pale green and black-and-white checkerboard for Prada; light blue and damask motifs for Miu Miu.
- [Apple's first Mexico store](https://www.apple.com/newsroom/2016/09/apple-to-open-first-store-in-mexico-saturday/): oak tables, terrazzo/quartz and Avenues display language.
- [Anthropologie stores](https://www.urbn.com/our-brands/anthropologie/visit-our-stores): handmade windows and artful installations.
- [Herzog & de Meuron, UNIQLO Tokyo](https://www.herzogdemeuron.com/projects/517-uniqlo-tokyo/): exposed grid, wood vitrines, open corners and glass.
- [LVMH, Sephora Champs-Élysées](https://www.lvmh.com/en/news-lvmh/sephora-unveils-new-flagship-champs-elysees-store): black-and-white identity and beauty departments.
- [Nike House of Innovation](https://www.nike.com/house-of-innovation): sport, Sneaker Lab and City Shop reference language.

Existing documented Aritzia, AllSaints and Free People references remain in `research-v12/interior-references.json`. These references inform original game interpretations; rooms are not measured replicas of individual real branches. Unknown brands retain their real name and an appropriate category treatment without claiming a researched exact interior.

## Physical shopping

The compact interior toolbar shows the store name, current display page, five main actions and a collapsed department chooser. Try-on, Bag and Returns route to their physical service stations. Checkout and returns selected inside the product catalog also walk there before opening the corresponding interface. Item fitting still temporarily previews equipment, while buying, wearing, receipt validation, final sale and returning retain the existing engine rules.

Door entry/exit has a short fade that respects reduced motion. A nearby store doorway takes precedence over the crowd's generic interaction prompt; directly selecting a shopper still allows conversation. Saved progress, catalog IDs, prices and mall geometry revision remain unchanged.
