-- ============================================================
--  Filament Finder - MySQL schema
--  Extended version with more materials + filaments
--  Idea: small clean demo DB that matches the JSON dataset.
-- ============================================================

-- Optional: create a dedicated database
-- CREATE DATABASE filament_finder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE filament_finder;

-- ------------------------------------------------------------
--  Table: material
--  Stores the general material types (PLA, PETG, ASA, TPU, PLA-Wood, etc.)
--  This table describes the typical behavior of the material,
--  not a specific brand.
-- ------------------------------------------------------------

DROP TABLE IF EXISTS filament;
DROP TABLE IF EXISTS material;

CREATE TABLE material (
  material_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name               VARCHAR(50) NOT NULL UNIQUE,  -- e.g. PLA, PETG, ASA, TPU, PLA-Wood
  description        VARCHAR(255),                 -- short explanation what this material is good for
  nozzle_temp_min    SMALLINT,                     -- rough default range for nozzle temp
  nozzle_temp_max    SMALLINT,
  bed_temp_min       SMALLINT,
  bed_temp_max       SMALLINT,
  needs_enclosure    TINYINT(1) DEFAULT 0,         -- 1 = prefers enclosure / warm environment (ABS/ASA)
  is_flexible        TINYINT(1) DEFAULT 0,         -- 1 = flexible (TPU etc.)
  notes              TEXT                          -- longer notes / tips
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Insert base material types
--  Temperatures are "typical ranges", not super exact.
-- ------------------------------------------------------------
INSERT INTO material
  (name, description, nozzle_temp_min, nozzle_temp_max,
   bed_temp_min, bed_temp_max, needs_enclosure, is_flexible, notes)
VALUES
  -- PLA: the classic "default" filament
  ('PLA',
   'Easy to print, low warp, good for beginners.',
   190, 230,
   25, 60,
   0, 0,
   'Generic PLA range based on common recommendations.'),

  -- PETG: tougher than PLA, a bit more stringy
  ('PETG',
   'Tougher than PLA, slightly flexible, needs good cooling.',
   230, 250,
   70, 90,
   0, 0,
   'Typical PETG range; can be stringy and likes a hotter bed.'),

  -- ASA: outdoor friendly, wants warm and draft free
  ('ASA',
   'Heat and UV resistant, better for outdoor parts.',
   240, 270,
   90, 110,
   1, 0,
   'Needs a stable warm environment or enclosure to reduce warping.'),

  -- TPU: flexible, needs slower speeds
  ('TPU',
   'Flexible filament, needs slower printing and a good filament path.',
   210, 240,
   0, 60,
   0, 1,
   'Typical range for 95A-type TPU; prefers low speeds.'),

  -- PLA-Wood: wood-like look, but still based on PLA
  ('PLA-Wood',
   'PLA-based woodlike material, often needs slightly higher temps.',
   200, 235,
   40, 65,
   0, 0,
   'Wood / woodlike PLA; larger nozzle and dry storage are recommended.'),

  -- PLA-Silk: glossy, nice for decorative parts
  ('PLA-Silk',
   'PLA blend with a silky glossy surface, often used for display parts.',
   205, 230,
   50, 70,
   0, 0,
   'Silk-style PLA: likes a bit more heat and slower speeds for a nice finish.'),

  -- PLA-Carbon: stiffer, reinforced with carbon fibers
  ('PLA-Carbon',
   'PLA with carbon fiber, stiffer and more heat-resistant than plain PLA.',
   220, 240,
   50, 70,
   0, 0,
   'Abrasive on brass nozzles; a hardened nozzle is recommended.'),

  -- PLA-Glow: glow in the dark
  ('PLA-Glow',
   'Glow-in-the-dark PLA with phosphorescent additives.',
   210, 230,
   50, 60,
   0, 0,
   'Glow pigments can be a bit abrasive; avoid very tiny nozzles.'),

  -- PETG-CF: PETG plus carbon fiber
  ('PETG-CF',
   'Carbon-fiber reinforced PETG, strong and heat-resistant.',
   240, 260,
   70, 90,
   0, 0,
   'Very stiff and abrasive; likes dry storage and textured beds.'),

  -- ABS: classic engineering plastic, warps easily
  ('ABS',
   'Engineering plastic, stronger than PLA but prone to warping.',
   230, 250,
   90, 110,
   1, 0,
   'Needs an enclosure or at least a draft-free environment and good ventilation.');

-- ------------------------------------------------------------
--  Table: filament
--  Stores specific products (brand + product name).
--  Each filament points to one material type.
-- ------------------------------------------------------------
CREATE TABLE filament (
  filament_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  brand              VARCHAR(100) NOT NULL,    -- e.g. Prusament, eSUN, Hatchbox, Polymaker, Overture
  product_name       VARCHAR(150) NOT NULL,    -- e.g. "PLA Jet Black"
  material_id        INT UNSIGNED NOT NULL,    -- FK to material
  color              VARCHAR(30),              -- in your project mostly 'black', 'white' or NULL
  nozzle_temp_min    SMALLINT NOT NULL,
  nozzle_temp_max    SMALLINT NOT NULL,
  bed_temp_min       SMALLINT,
  bed_temp_max       SMALLINT,
  special_type       VARCHAR(50),              -- e.g. 'wood', 'silk', 'carbon-fiber', 'glow-in-the-dark'
  notes              TEXT,
  CONSTRAINT fk_filament_material
    FOREIGN KEY (material_id)
    REFERENCES material (material_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Example filaments
--  Brands: Prusament, eSUN, Hatchbox, Polymaker, Overture
--  Colors: mainly black / white / no color on purpose.
--  Temperature ranges are based on typical manufacturer profiles
--  (rounded a bit so they fit nicely into your filter logic).
-- ------------------------------------------------------------
INSERT INTO filament
  (brand, product_name, material_id, color,
   nozzle_temp_min, nozzle_temp_max,
   bed_temp_min, bed_temp_max,
   special_type, notes)
VALUES
  -- =========================
  -- Prusament (Prusa Research)
  -- =========================
  ('Prusament',
   'PLA Jet Black',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'black',
   200, 220,
   50, 60,
   NULL,
   'Premium PLA, easy to print. Based on Prusament PLA recommendations (~210C, 40-60C bed).'),
  ('Prusament',
   'PETG Jet Black',
   (SELECT material_id FROM material WHERE name = 'PETG'),
   'black',
   220, 240,
   70, 90,
   NULL,
   'Based on Prusament PETG guidance (around 230C nozzle, ~80C bed).'),
  ('Prusament',
   'ASA Traffic White',
   (SELECT material_id FROM material WHERE name = 'ASA'),
   'white',
   250, 270,
   100, 110,
   NULL,
   'ASA with higher temps; better in an enclosure, UV-resistant for outdoor use.'),
  ('Prusament',
   'PLA Silk White',
   (SELECT material_id FROM material WHERE name = 'PLA-Silk'),
   'white',
   210, 225,
   55, 65,
   'silk',
   'Glossy silk-style PLA for display parts; likes slightly slower speeds.'),
  ('Prusament',
   'PLA Carbon Black',
   (SELECT material_id FROM material WHERE name = 'PLA-Carbon'),
   'black',
   220, 235,
   55, 65,
   'carbon-fiber',
   'Stiffer PLA with carbon fibers; a hardened nozzle is strongly recommended.'),
  ('Prusament',
   'Glow PLA White Base',
   (SELECT material_id FROM material WHERE name = 'PLA-Glow'),
   'white',
   215, 230,
   50, 60,
   'glow-in-the-dark',
   'Glow-in-the-dark PLA; good for markers or decorative prints.'),

  -- =========
  -- eSUN
  -- =========
  ('eSUN',
   'PLA+ Black',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'black',
   200, 220,
   50, 60,
   NULL,
   'Typical eSUN PLA+ range, slightly tougher than basic PLA.'),
  ('eSUN',
   'PETG Black',
   (SELECT material_id FROM material WHERE name = 'PETG'),
   'black',
   230, 250,
   70, 90,
   NULL,
   'Standard eSUN PETG; slower prints help against stringing.'),
  ('eSUN',
   'PLA-Wood (woodlike)',
   (SELECT material_id FROM material WHERE name = 'PLA-Wood'),
   NULL,
   200, 230,
   40, 60,
   'wood',
   'PLA-based woodlike filament; avoid very small nozzles.'),
  ('eSUN',
   'ABS+ Black',
   (SELECT material_id FROM material WHERE name = 'ABS'),
   'black',
   235, 250,
   95, 110,
   NULL,
   'ABS+ style settings; enclosure and good bed adhesion recommended.'),
  ('eSUN',
   'PLA Silk White',
   (SELECT material_id FROM material WHERE name = 'PLA-Silk'),
   'white',
   210, 225,
   55, 65,
   'silk',
   'Silky PLA for aesthetic prints; slower speeds reduce stringing.'),
  ('eSUN',
   'PLA Glow Black Base',
   (SELECT material_id FROM material WHERE name = 'PLA-Glow'),
   'black',
   215, 230,
   50, 60,
   'glow-in-the-dark',
   'Dark glow-in-the-dark variant; likes dry storage and around a 0.4-0.6 mm nozzle.'),
  ('eSUN',
   'TPU Black 95A',
   (SELECT material_id FROM material WHERE name = 'TPU'),
   'black',
   215, 230,
   0, 50,
   'flexible',
   'Standard 95A TPU; slow print speeds and a direct drive extruder are ideal.'),
  ('eSUN',
   'ASA White',
   (SELECT material_id FROM material WHERE name = 'ASA'),
   'white',
   245, 265,
   95, 110,
   NULL,
   'UV-resistant ASA; works best in an enclosed printer.'),

  -- =========
  -- Hatchbox
  -- =========
  ('Hatchbox',
   'PLA White',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'white',
   200, 220,
   50, 60,
   NULL,
   'Common Hatchbox PLA settings (~200C, 50-60C bed).'),
  ('Hatchbox',
   'PETG Black',
   (SELECT material_id FROM material WHERE name = 'PETG'),
   'black',
   230, 250,
   70, 85,
   NULL,
   'PETG for strong, slightly flexible parts; based on Hatchbox PETG ranges.'),
  ('Hatchbox',
   'ABS Black',
   (SELECT material_id FROM material WHERE name = 'ABS'),
   'black',
   235, 250,
   95, 110,
   NULL,
   'Classic ABS profile with heated bed and enclosure.'),
  ('Hatchbox',
   'PLA Silk White',
   (SELECT material_id FROM material WHERE name = 'PLA-Silk'),
   'white',
   210, 225,
   55, 65,
   'silk',
   'Silk PLA profile tuned for Hatchbox-style recommendations.'),
  ('Hatchbox',
   'PLA Carbon Black',
   (SELECT material_id FROM material WHERE name = 'PLA-Carbon'),
   'black',
   225, 240,
   55, 70,
   'carbon-fiber',
   'Carbon fiber PLA; matte surface and higher stiffness, but abrasive.'),
  ('Hatchbox',
   'TPU White 95A',
   (SELECT material_id FROM material WHERE name = 'TPU'),
   'white',
   215, 230,
   0, 50,
   'flexible',
   'White flexible filament for gaskets, bumpers and dampers.'),
  ('Hatchbox',
   'PETG White',
   (SELECT material_id FROM material WHERE name = 'PETG'),
   'white',
   235, 250,
   75, 90,
   NULL,
   'Generic PETG profile; moderate cooling to avoid stringing.'),

  -- ==========
  -- Polymaker
  -- ==========
  ('Polymaker',
   'PolyLite PLA Black',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'black',
   200, 220,
   40, 60,
   NULL,
   'Based on Polymaker PolyLite/PolyTerra PLA ranges (around 190-230C, 25-60C bed).'),
  ('Polymaker',
   'PolyWood (PLA-Wood)',
   (SELECT material_id FROM material WHERE name = 'PLA-Wood'),
   NULL,
   210, 225,
   45, 55,
   'wood',
   'PolyWood woodlike PLA; Polymaker recommends roughly 210C nozzle and ~50C bed.'),
  ('Polymaker',
   'PolyLite ABS White',
   (SELECT material_id FROM material WHERE name = 'ABS'),
   'white',
   235, 250,
   95, 110,
   NULL,
   'ABS tuned for PolyLite profiles; an enclosure or draft shield helps a lot.'),
  ('Polymaker',
   'PolyLite PETG-CF Black',
   (SELECT material_id FROM material WHERE name = 'PETG-CF'),
   'black',
   245, 260,
   75, 90,
   'carbon-fiber',
   'Carbon-fiber PETG; high stiffness, abrasive, likes textured PEI beds.'),
  ('Polymaker',
   'PolyLite PLA Silk White',
   (SELECT material_id FROM material WHERE name = 'PLA-Silk'),
   'white',
   210, 225,
   55, 65,
   'silk',
   'Silky PLA for smooth visual prototypes.'),
  ('Polymaker',
   'PolyFlex TPU Black',
   (SELECT material_id FROM material WHERE name = 'TPU'),
   'black',
   220, 235,
   0, 60,
   'flexible',
   'PolyFlex-style profile; a bit more flow can improve layer bonding.'),

  -- ==========
  -- Overture
  -- ==========
  ('Overture',
   'PLA Black',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'black',
   200, 220,
   50, 60,
   NULL,
   'Budget-friendly PLA; many profiles use around 200-210C, 50-60C bed.'),
  ('Overture',
   'PETG White',
   (SELECT material_id FROM material WHERE name = 'PETG'),
   'white',
   230, 250,
   80, 90,
   NULL,
   'Based on Overture PETG official recommendation (230-250C nozzle, 80-90C bed).'),
  ('Overture',
   'PLA Matte Black',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'black',
   205, 220,
   50, 60,
   'matte',
   'Matte PLA look; hides layer lines a bit better.'),
  ('Overture',
   'PLA Glow White Base',
   (SELECT material_id FROM material WHERE name = 'PLA-Glow'),
   'white',
   215, 230,
   50, 60,
   'glow-in-the-dark',
   'Glow PLA based on typical Overture-style profiles.'),
  ('Overture',
   'ABS White',
   (SELECT material_id FROM material WHERE name = 'ABS'),
   'white',
   235, 250,
   95, 110,
   NULL,
   'General ABS profile; likes an enclosure or at least a draft-free setup.'),
  ('Overture',
   'PETG Black',
   (SELECT material_id FROM material WHERE name = 'PETG'),
   'black',
   235, 250,
   80, 90,
   NULL,
   'Overture-style PETG profile; good for strong functional parts.'),
  ('Overture',
   'PLA White',
   (SELECT material_id FROM material WHERE name = 'PLA'),
   'white',
   200, 215,
   50, 60,
   NULL,
   'Standard white PLA profile for quick prints and prototypes.');
