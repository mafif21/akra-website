"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ArrowRightIcon, MenuIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { navItems, siteConfig } from "@/lib/config";
import { formatIndex } from "@/lib/format";
import { interpolate, localizedPath, type Locale, type Wording } from "@/lib/i18n";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type NavbarWording = Pick<Wording, "navbar" | "customOrder">;

type NavbarProps = {
  locale: Locale;
  wording: NavbarWording;
};

export function Navbar({ locale, wording }: NavbarProps) {
  const { navbar, customOrder } = wording;
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeOrder = () => setOrderOpen(false);
  const closeMenu = () => setMenuOpen(false);
  const homeHref = localizedPath(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="grid h-header grid-cols-nav items-center gap-2 px-gutter sm:gap-3">
        <div className="justify-self-start">
          {/* Below `sm` the outline collapses to an underlined label so the brand stays centered. */}
          <Button
            variant="outline"
            size="sm"
            aria-haspopup="dialog"
            onClick={() => setOrderOpen(true)}
            className="max-sm:border-0 max-sm:px-0 max-sm:tracking-wider max-sm:underline max-sm:decoration-1 max-sm:underline-offset-4 max-sm:hover:bg-transparent max-sm:hover:text-primary"
          >
            {navbar.customOrder}
          </Button>
        </div>

        {/* Brand: swap the text for a next/image logo later. */}
        <Link
          href={homeHref}
          aria-label={navbar.homeLabel}
          className="font-heading text-xl font-medium tracking-widest text-text sm:text-2xl md:text-3xl"
        >
          {navbar.brand}
        </Link>

        <div className="justify-self-end">
          <Button
            variant="ghost"
            size="sm"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label={navbar.openMenu}
            onClick={() => setMenuOpen(true)}
            className="-mr-3 sm:-mr-5"
          >
            <span className="hidden sm:inline">{navbar.menu}</span>
            <MenuIcon className="size-6" />
          </Button>
        </div>
      </div>

      <Modal
        open={orderOpen}
        onClose={closeOrder}
        eyebrow={customOrder.eyebrow}
        title={customOrder.title}
        description={customOrder.description}
        closeLabel={customOrder.close}
      >
        <CustomOrderForm wording={customOrder} onSubmitted={closeOrder} />
      </Modal>

      <Drawer
        open={menuOpen}
        onClose={closeMenu}
        title={navbar.menu}
        closeLabel={navbar.closeMenu}
      >
        <nav aria-label={navbar.navLabel} className="px-gutter py-6">
          <m.ul variants={staggerContainer(0.08, 0.25)} initial="hidden" animate="visible">
            {navItems.map((item, index) => (
              <m.li key={item.key} variants={fadeUp} className="border-b border-line">
                <Link
                  href={item.href === "/" ? homeHref : item.href}
                  onClick={closeMenu}
                  className="group flex items-baseline gap-5 py-5"
                >
                  <span className="text-xs text-muted tabular-nums">
                    {formatIndex(index)}
                  </span>
                  <span className="link-underline font-heading text-3xl transition-colors duration-500 ease-soft group-hover:text-primary md:text-4xl">
                    {navbar.links[item.key]}
                  </span>
                </Link>
              </m.li>
            ))}
          </m.ul>
        </nav>
      </Drawer>
    </header>
  );
}

type OrderWording = Wording["customOrder"];

type OrderDetails = {
  name: string;
  country: string;
  product: string;
  orderSize: string;
  details: string;
};

function CustomOrderForm({
  wording,
  onSubmitted,
}: {
  wording: OrderWording;
  onSubmitted: () => void;
}) {
  const id = useId();
  const { fields } = wording;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: keyof OrderDetails) => String(data.get(name) ?? "").trim();

    const message = buildOrderMessage(wording, {
      name: value("name"),
      country: value("country"),
      product: value("product"),
      orderSize: value("orderSize"),
      details: value("details"),
    });

    window.open(buildWhatsAppUrl(siteConfig.whatsappNumber, message), "_blank", "noopener,noreferrer");
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
      <Field label={fields.name.label} htmlFor={`${id}-name`}>
        <Input
          id={`${id}-name`}
          name="name"
          required
          autoComplete="name"
          placeholder={fields.name.placeholder}
        />
      </Field>

      <Field label={fields.country.label} htmlFor={`${id}-country`}>
        <Input
          id={`${id}-country`}
          name="country"
          required
          autoComplete="country-name"
          placeholder={fields.country.placeholder}
        />
      </Field>

      <Field label={fields.product.label} htmlFor={`${id}-product`} optionalLabel={wording.optional}>
        <Select id={`${id}-product`} name="product" defaultValue="">
          <option value="">{fields.product.placeholder}</option>
          {Object.entries(fields.product.options).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={fields.orderSize.label} htmlFor={`${id}-orderSize`} optionalLabel={wording.optional}>
        <Select id={`${id}-orderSize`} name="orderSize" defaultValue="">
          <option value="">{fields.orderSize.placeholder}</option>
          {Object.entries(fields.orderSize.options).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label={fields.details.label}
        htmlFor={`${id}-details`}
        optionalLabel={wording.optional}
        className="sm:col-span-2"
      >
        <Textarea
          id={`${id}-details`}
          name="details"
          rows={3}
          placeholder={fields.details.placeholder}
        />
      </Field>

      <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" className="group w-full sm:w-auto" aria-describedby={`${id}-note`}>
          {wording.submit}
          <ArrowRightIcon className="size-4 transition-transform duration-500 ease-soft group-hover:translate-x-1" />
        </Button>
        <p id={`${id}-note`} className="text-sm text-muted sm:max-w-56">
          {wording.note}
        </p>
      </div>
    </form>
  );
}

/**
 * "Hello, I'm {name} from {country}…" followed by whichever optional details
 * were filled in, in the visitor's language.
 */
function buildOrderMessage(wording: OrderWording, order: OrderDetails): string {
  const { whatsapp, fields } = wording;
  const optionLabel = (options: Record<string, string>, key: string) => options[key] ?? key;

  const specs = [
    order.product &&
      interpolate(whatsapp.product, { value: optionLabel(fields.product.options, order.product) }),
    order.orderSize &&
      interpolate(whatsapp.orderSize, { value: optionLabel(fields.orderSize.options, order.orderSize) }),
  ].filter(Boolean);

  return [
    interpolate(whatsapp.intro, { name: order.name, country: order.country }),
    specs.join("\n"),
    order.details && interpolate(whatsapp.details, { value: order.details }),
  ]
    .filter(Boolean)
    .join("\n\n");
}
