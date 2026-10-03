# AssetFlow Studio — გაყიდვების საიტი

AssetFlow Studio-ს მარკეტინგული საიტი: **https://assetsflow.netlify.app/**

სტატიკური საიტია (HTML + CSS + JS, build-ის გარეშე). `main` ბრენჩზე ყოველი push ავტომატურად ქვეყნდება Netlify-ზე.

## სტრუქტურა

```
index.html            მთავარი გვერდი (ქართული)
en/index.html         English version
privacy.html          კონფიდენციალურობის პოლიტიკა (KA)  ·  en/privacy.html (EN)
thanks.html           ფორმის გაგზავნის შემდეგ (KA)        ·  en/thanks.html (EN)
404.html              გვერდი ვერ მოიძებნა
assets/css/styles.css ყველა სტილი
assets/js/main.js     მენიუ, ტაბები, გალერეა, lightbox, ფორმა
assets/icons.svg      აიკონების sprite (Lucide, ISC)
images/screens/       აპლიკაციის სქრინები — {name}.webp (სრული) + {name}-sm.webp (720px)
images/og-image.jpg   სოციალური ქსელების preview (1200×630)
netlify.toml          უსაფრთხოების header-ები (CSP, HSTS…) და ქეშირება
robots.txt, sitemap.xml, site.webmanifest
```

## ლოკალურად ნახვა

```bash
npx serve .
```

## სქრინის დამატება ან შეცვლა

1. სქრინი გადაიყვანეთ WebP-ში ორ ზომად: სრული (≈1340px სიგანე) და `-sm` (720px). კონფიდენციალური მონაცემები (კომპანიის სახელი, პირები, ს/კ) წინასწარ დაფარეთ.
2. ფაილები ჩადეთ `images/screens/`-ში.
3. გალერეაში დაამატეთ `<figure class="shot" data-category="…">` ბლოკი **ორივე** გვერდზე (`index.html` და `en/index.html`). კატეგორიები: `finance`, `medical`, `ops`, `admin`.

## დემოს ფორმა (Netlify Forms)

ფორმა `demo-request` მუშაობს Netlify Forms-ით. ერთჯერადად საჭიროა:
Netlify → Site configuration → **Forms** → *Enable form detection*, შემდეგ **Form notifications** → ელ-ფოსტის შეტყობინება `assetsflowstudio@gmail.com`-ზე.

## ტექსტის რედაქტირება

ქართული და ინგლისური ტექსტი ცალ-ცალკე ფაილებშია. ცვლილება ორივეში შეიტანეთ, რომ ვერსიები ერთმანეთს ემთხვეოდეს.
