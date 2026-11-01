import { useState, type FormEvent } from "react";
export default function Footer({
  onInfo,
}: {
  onInfo: (title: string) => void;
}) {
  const [subscribed, setSubscribed] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };
  return (
    <>
      <section id="newsletter" className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <h2>Inscreva-se na nossa newsletter</h2>
            <p>
              Assine a nossa newsletter e receba as novidades e conteúdos
              exclusivos da Econverse.
            </p>
          </div>
          {subscribed ? (
            <div className="newsletter-success" role="status">
              <strong>Obrigado pelo interesse!</strong>
              <p>Inscrição demonstrativa registrada nesta sessão.</p>
              <button onClick={() => setSubscribed(false)}>
                Cadastrar outro e-mail
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="newsletter-fields">
                <input
                  required
                  minLength={2}
                  name="name"
                  autoComplete="given-name"
                  aria-label="Seu nome"
                  placeholder="Digite seu nome"
                />
                <input
                  required
                  name="email"
                  autoComplete="email"
                  type="email"
                  aria-label="Seu e-mail"
                  placeholder="Digite seu e-mail"
                />
                <button className="button yellow">Inscrever</button>
              </div>
              <label className="consent">
                <input required type="checkbox" />
                Aceito os{" "}
                <button
                  type="button"
                  onClick={() => onInfo("Termos e Condições")}
                >
                  termos e condições
                </button>
              </label>
            </form>
          )}
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img
              src="/assets/d4234.svg"
              alt="Econverse"
              width="164"
              height="48"
            />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="socials">
              {[
                ["Instagram", "cf779", "https://www.instagram.com/econverse/"],
                ["Facebook", "7b3e5", "https://www.facebook.com/econverse"],
                [
                  "LinkedIn",
                  "d0bff",
                  "https://www.linkedin.com/company/econverse/",
                ],
              ].map(([name, file, href]) => (
                <a
                  href={href}
                  key={name}
                  aria-label={name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={`/assets/${file}.svg`} alt="" />
                </a>
              ))}
            </div>
          </div>
          <div className="footer-divider">
            <img src="/assets/f6877.svg" alt="" />
          </div>
          <div className="footer-columns">
            {[
              ["Institucional", "Sobre Nós", "Movimento", "Trabalhe conosco"],
              ["Ajuda", "Suporte", "Fale Conosco", "Perguntas Frequentes"],
              [
                "Termos",
                "Termos e Condições",
                "Política de Privacidade",
                "Troca e Devolução",
              ],
            ].map(([title, ...links]) => (
              <div key={title}>
                <h3>{title}</h3>
                {links.map((link) => (
                  <button key={link} onClick={() => onInfo(link)}>
                    {link}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
      <div className="copyright">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
    </>
  );
}
