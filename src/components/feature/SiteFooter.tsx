import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="mt-20 bg-foreground-950 text-background-100">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-foreground-950">
                <i className="ri-steering-2-line text-lg" aria-hidden="true" />
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight text-background-50">
                Motora<span className="text-primary-500">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background-300">
              El marketplace de autos de Costa Rica. Comprá y vendé tu vehículo con información clara y
              contacto directo, sin intermediarios.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {['ri-facebook-circle-line', 'ri-instagram-line', 'ri-whatsapp-line', 'ri-tiktok-line'].map((icon) => (
                <span
                  key={icon}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background-50/10 text-background-100"
                >
                  <i className={`${icon} text-base`} aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-background-50">
              <Link to="/autos" className="cursor-pointer transition-colors hover:text-primary-400">
                Comprar
              </Link>
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-background-300">
              <li>
                <Link to="/autos" className="cursor-pointer transition-colors hover:text-background-50">
                  Todos los vehículos
                </Link>
              </li>
              <li>
                <Link to="/autos?body=Suv" className="cursor-pointer transition-colors hover:text-background-50">
                  SUVs y 4x4
                </Link>
              </li>
              <li>
                <Link to="/autos?body=Pickup" className="cursor-pointer transition-colors hover:text-background-50">
                  Pickups
                </Link>
              </li>
              <li>
                <Link to="/autos?body=Sedan" className="cursor-pointer transition-colors hover:text-background-50">
                  Sedanes
                </Link>
              </li>
              <li>
                <Link to="/autos?sort=price-asc" className="cursor-pointer transition-colors hover:text-background-50">
                  Menores precios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-background-50">
              <Link to="/publicar" className="cursor-pointer transition-colors hover:text-primary-400">
                Vender
              </Link>
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-background-300">
              <li>
                <Link to="/publicar" className="cursor-pointer transition-colors hover:text-background-50">
                  Publicar un vehículo
                </Link>
              </li>
              <li>
                <Link to="/registro" className="cursor-pointer transition-colors hover:text-background-50">
                  Crear cuenta gratis
                </Link>
              </li>
              <li>
                <Link to="/ingresar" className="cursor-pointer transition-colors hover:text-background-50">
                  Ingresar a mi cuenta
                </Link>
              </li>
              <li>
                <Link to="/mi-cuenta" className="cursor-pointer transition-colors hover:text-background-50">
                  Administrar mis anuncios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-background-50">Contacto</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-background-300">
              <li className="flex items-start gap-2">
                <i className="ri-map-pin-line mt-0.5 text-primary-400" aria-hidden="true" />
                <span>San José, Costa Rica</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-phone-line mt-0.5 text-primary-400" aria-hidden="true" />
                <span>+506 4000 1234</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-mail-line mt-0.5 text-primary-400" aria-hidden="true" />
                <span>hola@motora.cr</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-time-line mt-0.5 text-primary-400" aria-hidden="true" />
                <span>Lunes a viernes, 8:00 a 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-background-50/10 pt-6 text-xs text-background-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Motora. Todos los derechos reservados.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="whitespace-nowrap">Términos y condiciones</span>
            <span className="whitespace-nowrap">Política de privacidad</span>
            <span className="whitespace-nowrap">Hecho en Costa Rica</span>
          </p>
        </div>
      </div>
    </footer>
  );
}