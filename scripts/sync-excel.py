#!/usr/bin/env python3
"""
Anadolu Spotting Team - Excel Sync Script
Reads 'üyeller.xlsx' and generates 'js/members-data.js'
"""

import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX_PATH = os.path.join(BASE_DIR, "üyeller.xlsx")
OUTPUT_JS = os.path.join(BASE_DIR, "js", "members-data.js")
IMG_MEMBERS_DIR = os.path.join(BASE_DIR, "img", "members")

# Known full names or overrides based on photo names and community handles
NAME_OVERRIDES = {
    "memospotting": "Mehmet Küçükalemdar",
    "spotter_keremm": "Ali Kerem Öztürk",
}

def sync():
    if not os.path.exists(XLSX_PATH):
        print(f"Error: Excel file not found at {XLSX_PATH}")
        return

    avail_photos = os.listdir(IMG_MEMBERS_DIR) if os.path.exists(IMG_MEMBERS_DIR) else []
    print(f"Found {len(avail_photos)} photos in {IMG_MEMBERS_DIR}")

    with zipfile.ZipFile(XLSX_PATH, "r") as z:
        shared_strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
                t = "".join([node.text for node in si.iter() if node.text])
                shared_strings.append(t)

        sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
        rows = sheet.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row")

        members = []
        # Skip header row (row 1)
        for r in rows[1:]:
            row_dict = {}
            for c in r.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
                cell_ref = c.attrib.get("r")
                col = "".join([ch for ch in cell_ref if ch.isalpha()])
                cell_type = c.attrib.get("t")
                val_el = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                val = val_el.text if val_el is not None else ""
                if cell_type == "s" and val.isdigit():
                    val = shared_strings[int(val)]
                row_dict[col] = val.strip() if val else ""

            link = row_dict.get("A", "")
            mevki = row_dict.get("B", "Üye")
            isim = row_dict.get("C", "")
            sehir = row_dict.get("D", "")

            username = ""
            if "instagram.com/" in link:
                username = link.rstrip("/").split("/")[-1].split("?")[0]
            else:
                username = link

            # Determine Full Name
            full_name = isim
            if username in NAME_OVERRIDES and (not full_name or full_name == username):
                full_name = NAME_OVERRIDES[username]

            # Match photo
            photo = ""
            for p in avail_photos:
                p_base = os.path.splitext(p)[0].strip().lower()
                # 1. Match with full name
                if full_name and full_name.lower() == p_base:
                    photo = f"img/members/{p}"
                    break
                # 2. Match with username
                if username and username.lower() == p_base:
                    photo = f"img/members/{p}"
                    break
                # 3. Substring / special heuristics
                if username == "ltauspotter" and "ltau" in p_base:
                    photo = f"img/members/{p}"
                    break
                if username == "memospotting" and "küçükalemdar" in p_base:
                    photo = f"img/members/{p}"
                    break
                if username == "spotter_keremm" and "kerem" in p_base:
                    photo = f"img/members/{p}"
                    break
                if username == "spotter_taha1" and "taha" in p_base:
                    photo = f"img/members/{p}"
                    break

            members.append({
                "name": username,
                "fullName": full_name,
                "city": sehir,
                "role": mevki,
                "link": link,
                "photo": photo
            })

    print(f"Total members parsed from Excel: {len(members)}")

    # Generate members-data.js content
    js_content = """// Anadolu Spotting Team — Üye Veritabanı
// Excel dosyasından (üyeller.xlsx) otomatik aktarılmıştır.
// Toplam """ + str(len(members)) + """ Üye

const MEMBERS = """ + json.dumps(members, ensure_ascii=False, indent=2) + """;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MEMBERS };
}
"""

    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Successfully wrote {len(members)} members to {OUTPUT_JS}")

if __name__ == "__main__":
    sync()
