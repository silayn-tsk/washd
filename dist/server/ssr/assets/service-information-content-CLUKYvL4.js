import { t as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as useSiteContent } from "./use-site-content-ltrE_RuD.js";
import { t as siteUrl } from "./site-url-D67-DU0W.js";
//#region app/service-information-content.tsx
var import_jsx_runtime = require_jsx_runtime();
var planDescriptionsMs = {
	starter: "Satu beg 5 kg untuk dibasuh, dikeringkan dan dilipat sekali seminggu.",
	active: "Satu beg 5 kg untuk dibasuh, dikeringkan dan dilipat dua kali seminggu.",
	professional: "Satu beg 7 kg dan empat helai kemeja bergosok sekali seminggu.",
	executive: "Satu beg 7 kg dan tujuh helai kemeja bergosok sekali seminggu."
};
var addonNamesMs = {
	"extra-shirts": "4 helai kemeja bergosok tambahan",
	"extra-bag": "Satu beg 5 kg tambahan",
	"fragrance-free": "Penjagaan tanpa pewangi",
	"priority-return": "Pemulangan keutamaan 24 jam"
};
function ServiceInformationContent({ locale }) {
	const { content, plans, addons } = useSiteContent();
	const ms = locale === "ms";
	const serviceArea = ms && content.contact.serviceArea === "Selected residential buildings in Kuala Lumpur" ? "Bangunan kediaman terpilih di Kuala Lumpur" : content.contact.serviceArea;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "1. Pembekal dan laman web" : "1. Supplier and website" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Perkhidmatan ini ditawarkan oleh ",
				content.contact.legalName || "Washd",
				" melalui ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: siteUrl,
					children: siteUrl
				}),
				". Alamat e-mel ialah ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${content.contact.email}`,
					children: content.contact.email
				}),
				" dan nombor telefon/WhatsApp ialah ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://wa.me/${content.contact.whatsappNumber}`,
					children: content.contact.phoneDisplay
				}),
				"."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"This service is offered by ",
				content.contact.legalName || "Washd",
				" through ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: siteUrl,
					children: siteUrl
				}),
				". The email address is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${content.contact.email}`,
					children: content.contact.email
				}),
				" and the telephone/WhatsApp number is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://wa.me/${content.contact.whatsappNumber}`,
					children: content.contact.phoneDisplay
				}),
				"."
			] }) }),
			content.contact.registeredAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [ms ? "Alamat tempat perdagangan: " : "Place of business: ", content.contact.registeredAddress] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				ms ? "Kawasan perkhidmatan semasa: " : "Current service area: ",
				serviceArea,
				"."
			] })
		] })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "2. Ciri utama dan harga penuh" : "2. Main features and full prices" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Pelan keahlian semasa ialah:" : "The current membership plans are:" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
					plan.name,
					" - RM ",
					plan.price_rm,
					" ",
					ms ? "sebulan" : "per month",
					":"
				] }),
				" ",
				ms ? planDescriptionsMs[plan.id] || plan.description : plan.description,
				"."
			] }, plan.id)) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Tambahan bulanan pilihan:" : "Optional monthly add-ons:" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: addons.map((addon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
				ms ? addonNamesMs[addon.id] || addon.name : addon.name,
				" - RM ",
				addon.price_rm,
				" ",
				ms ? "sebulan" : "per month",
				"."
			] }) }, addon.id)) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Harga yang ditunjukkan termasuk pengumpulan dan pemulangan di tempat pengumpulan bangunan yang disahkan. Jumlah penuh bagi pelan dan tambahan terpilih, termasuk apa-apa cukai atau caj lain yang terpakai, dipaparkan sebelum bayaran disahkan. Tiada caj tambahan akan dikenakan tanpa persetujuan anda." : "Displayed prices include collection and return at the confirmed building collection point. The complete total for the selected plan and add-ons, including any applicable tax or other charge, is displayed before payment is confirmed. No additional charge will be imposed without your agreement." })
		] })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "3. Kaedah dan masa bayaran" : "3. Payment method and timing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Bayaran dibuat dalam Ringgit Malaysia melalui halaman pembayaran Stripe yang selamat menggunakan kad atau kaedah bayaran lain yang dipaparkan oleh Stripe. Jumlah pelan dan tambahan berulang secara bulanan sehingga dibatalkan. Washd tidak menyimpan nombor penuh kad." : "Payment is made in Malaysian Ringgit through secure Stripe-hosted checkout using a card or another payment method displayed by Stripe. The plan and selected add-ons recur monthly until cancelled. Washd does not store the complete card number." }) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "4. Pembekalan perkhidmatan" : "4. Supply of the service" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Beg dihantar sebelum 9:30 pagi pada hari laluan bangunan yang disahkan dan biasanya tersedia untuk diambil pada 5:30 petang dua hari kemudian: Isnin ke Rabu atau Rabu ke Jumaat. Jadual khusus bangunan anda akan disahkan sebelum perkhidmatan bermula. Kelewatan material akan dimaklumkan." : "Bags are dropped by 9:30am on the confirmed building route day and are normally ready at 5:30pm two days later: Monday to Wednesday or Wednesday to Friday. Your building-specific schedule is confirmed before service starts. Material delays will be communicated." }) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "5. Terma, pembatalan dan pembetulan" : "5. Terms, cancellation and corrections" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Baca ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/terms/bm",
				children: "Terma Perkhidmatan"
			}),
			" sebelum membuat bayaran. Anda boleh mengubah pelan dan tambahan atau kembali dari Stripe sebelum mengesahkan bayaran. Selepas pesanan dibuat, hubungi Washd dengan segera untuk membetulkan kesilapan. Pembatalan memerlukan sekurang-kurangnya dua minggu notis sebelum tempoh perkhidmatan seterusnya."
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Read the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/terms",
				children: "Service Terms"
			}),
			" before payment. You can change the plan and add-ons or return from Stripe before confirming payment. After an order is made, contact Washd promptly to correct an error. Cancellation requires at least two weeks’ notice before the next service period."
		] }) }) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "6. Pengakuterimaan dan rekod" : "6. Acknowledgement and records" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Bayaran yang berjaya diakui pada skrin, dalam akaun Washd dan melalui rekod/resit Stripe. Washd menyimpan rekod transaksi perdagangan elektronik sekurang-kurangnya tiga tahun apabila dikehendaki undang-undang." : "A successful payment is acknowledged on screen, in the Washd account and through the Stripe transaction/receipt record. Washd retains electronic trade transaction records for at least three years where required by law." }) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "7. Aduan dan remedi" : "7. Complaints and remedies" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Aduan atau permintaan pembetulan boleh dihantar melalui ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `mailto:${content.contact.email}`,
				children: content.contact.email
			}),
			" atau WhatsApp ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `https://wa.me/${content.contact.whatsappNumber}`,
				children: content.contact.phoneDisplay
			}),
			". Jika perkhidmatan tidak munasabah sesuai atau tidak seperti yang ditawarkan, Washd akan menyiasat dan memberikan remedi yang adil mengikut keadaan dan undang-undang yang terpakai. Lihat juga ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/care-guarantee/bm",
				children: "Jaminan Penjagaan Washd"
			}),
			"."
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Send a complaint or correction request to ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `mailto:${content.contact.email}`,
				children: content.contact.email
			}),
			" or WhatsApp ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `https://wa.me/${content.contact.whatsappNumber}`,
				children: content.contact.phoneDisplay
			}),
			". If a service is not reasonably fit or is not supplied as offered, Washd will investigate and provide a fair remedy according to the circumstances and applicable law. See the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/care-guarantee",
				children: "Washd Care Guarantee"
			}),
			"."
		] }) }) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: ms ? "8. Penjagaan dan keselamatan" : "8. Care and safety" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ms ? "Washd mematuhi label penjagaan dan amalan penjagaan pakaian profesional yang munasabah. Barang berbahaya, tercemar, menyalahi undang-undang atau tidak sesuai tidak boleh dimasukkan. Jika agensi berwibawa menetapkan standard keselamatan atau kesihatan yang terpakai kepada perkhidmatan, Washd akan mematuhinya." : "Washd follows care labels and reasonable professional garment-care practices. Hazardous, contaminated, illegal or unsuitable items must not be included. Where a competent authority specifies a safety or health standard applicable to the service, Washd will follow it." }) })] })
	] });
}
//#endregion
export { ServiceInformationContent };
