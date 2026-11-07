# Mallside v65 QA

The source suite has 804 cases. The final targeted checks verify both seat approaches across the 91 pending dining rooms, the camera sightline at all ten food halls and the timing of the seated hand pose. The compatibility checks cover all 8,863 complete catalog records, 1,598 shop identities, 23 navigation floors and schema 6 saves. The generated artifact contains 2,078 files and passes the local reference and notice checks.

Firefox 159.0.1 passes 12 native gameplay scenarios plus the exception check with no captured errors, resource warnings or input retries. The selection covers dining, cancellation, 2D payment, saved receipts, the café, route interruption, fitting, checkout, fullscreen and compact focus behavior.

Safari 26.6.2 passes three manual native scenarios in a private window. The 3D branch test covers free review, seat selection, payment, exit and the exact saved receipt after reload. The 3D public test verifies the food hall scenery and a visible seated diner after the camera and arcade fixes. The lightweight test blocks a paid meal with an empty wallet and serves free water. The private window was closed and remote automation was verified off.

Four touch checks cover 320 × 568 and 844 × 390 in 3D and 2D. The review and exit controls were reachable, and leaving before seating kept the wallet intact. The disposable Firefox browser, installer, driver and test files were removed. All 14 pre-existing Firefox Library entries were preserved.

[Validation record](research-v65/validation.json) · [Gameplay](GAMEPLAY-v65.md)
