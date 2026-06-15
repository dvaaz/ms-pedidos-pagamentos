import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home,
  LockKeyhole,
  MapPin,
  Plus,
  Store,
  X,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Mail
} from 'lucide-react';
import { checkoutMock } from '../../data/checkoutMock';
import { checkoutGateway } from '../../services/apiGateway';
import './styles.css';

function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandMark">S</span>
        <strong>ShirtStore</strong>
      </div>
      <div className="secure">
        <LockKeyhole size={16} strokeWidth={1.8} />
        <span>
          ambiente
          <strong>100% Seguro</strong>
        </span>
      </div>
    </header>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="checkoutSection">
      <div className="sectionLegend">
        <span>{number}</span>
        {title}
      </div>
      <div className="sectionBody">{children}</div>
    </section>
  );
}

function PersonalData({ customer }) {
  return (
    <dl className="personalData">
      <div>
        <dt>email:</dt>
        <dd>{customer.email}</dd>
      </div>
      <div>
        <dt>nome:</dt>
        <dd>{customer.name}</dd>
      </div>
      <div>
        <dt>telefone:</dt>
        <dd>{customer.phone}</dd>
      </div>
    </dl>
  );
}

function PaymentData({ payment }) {
  return (
    <fieldset className="paymentOptions">
      <label>
        <input type="radio" name="payment" defaultChecked />
        cartao: {payment.cardMask}
      </label>
      <label>
        <input type="radio" name="payment" />
        boleto
      </label>
      <label>
        <input type="radio" name="payment" />
        pix
      </label>
    </fieldset>
  );
}

function DeliveryData({ mode, setMode, pickup, selectedAddress, onOpenAddressList }) {
  const isPickup = mode === 'pickup';

  return (
    <div className="delivery">
      <div className="deliverySwitch" aria-label="tipo de entrega">
        <button className={!isPickup ? 'active' : ''} onClick={() => {
          setMode('delivery');
          onOpenAddressList();
        }}>
          <Home size={15} />
          receber
        </button>
        <button className={isPickup ? 'active' : ''} onClick={() => setMode('pickup')}>
          retirar
          <Store size={15} />
        </button>
      </div>

      {isPickup ? (
        <div className="pickupInfo">
          <strong>{pickup.store}</strong>
          <p>{pickup.message}</p>
        </div>
      ) : (
        <div className="addressSelected">
          <MapPin size={16} />
          <span>{selectedAddress ? selectedAddress.label : 'Selecione um endereco de entrega'}</span>
          <button onClick={onOpenAddressList}>alterar</button>
        </div>
      )}
    </div>
  );
}

function OrderSummary({ order }) {
  return (
    <aside className="summary">
      <h2>Resumo do Pedido</h2>
      <div className="summaryLine">
        <span>SubTotal ({order.items.length} item)</span>
        <strong>R$ {order.subtotal.toFixed(2)}</strong>
      </div>
      <div className="summaryLine">
        <span>Frete</span>
        <strong>{order.shipping ? `R$ ${order.shipping.toFixed(2)}` : ''}</strong>
      </div>
      <div className="summaryTotal">
        <span>Total</span>
        <strong>R$ {order.total.toFixed(2)}</strong>
      </div>
      <button className="primaryAction" onClick={() => checkoutGateway.finishOrder(order)}>
        Finalizar Compra
      </button>
    </aside>
  );
}

function AddressListModal({ addresses, onClose, onCreate, onSelect }) {
  return (
    <div className="modalBackdrop" role="presentation">
      <div className="modal addressList" role="dialog" aria-modal="true" aria-labelledby="address-list-title">
        <button className="closeButton" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>
        <h2 id="address-list-title">Endereco de entrega</h2>
        <button className="createAddress" onClick={onCreate}>
          <Plus size={18} />
          CRIAR NOVO ENDERECO
        </button>
        <div className="addressOptions">
          {addresses.map((address) => (
            <button key={address.id} onClick={() => onSelect(address)}>
              <MapPin size={17} />
              <span>
                <strong>{address.label}</strong>
                {address.details}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewAddressModal({ onClose, onSave }) {
  const [form, setForm] = useState(checkoutMock.emptyAddress);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="modalBackdrop" role="presentation">
      <div className="modal addressFormModal" role="dialog" aria-modal="true" aria-labelledby="new-address-title">
        <button className="closeButton" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>
        <h2 id="new-address-title">Criar novo endereco</h2>
        <div className="deliverySwitch modalSwitch" aria-label="tipo de entrega">
          <button className="active">
            <Home size={14} />
            receber
          </button>
          <button>
            retirar
            <Store size={14} />
          </button>
        </div>
        <form className="addressForm" onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}>
          <label className="cepField">
            Cep
            <input value={form.cep} onChange={(event) => update('cep', event.target.value)} />
          </label>
          <button className="zipHelp" type="button">
            Nao sei meu cep
            <ExternalLink size={13} />
          </button>
          <label className="full">
            Logradouro
            <input value={form.street} onChange={(event) => update('street', event.target.value)} />
          </label>
          <label>
            Numero
            <input value={form.number} onChange={(event) => update('number', event.target.value)} />
          </label>
          <label>
            Complemento
            <input value={form.complement} onChange={(event) => update('complement', event.target.value)} />
          </label>
          <label className="full">
            Nome do Destinatario
            <input value={form.recipient} onChange={(event) => update('recipient', event.target.value)} />
          </label>
          <div className="formActions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar endereco</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>ShirtStore</h3>
        <p>As melhores camisas com qualidade premium para voce. Moda, conforto e estilo em um so lugar.</p>
        <div className="social">
          <Facebook size={15} />
          <Instagram size={15} />
          <Twitter size={15} />
        </div>
      </div>
      <div>
        <h3>Links Rapidos</h3>
        <a>Catalogo</a>
        <a>Meus Pedidos</a>
        <a>Carrinho</a>
        <a>Sobre Nos</a>
      </div>
      <div>
        <h3>Categorias</h3>
        <a>Basicas</a>
        <a>Premium</a>
        <a>Polos</a>
        <a>Casuais</a>
        <a>Fashion</a>
      </div>
      <div>
        <h3>Contato</h3>
        <p><MapPin size={14} /> Rua das Camisas, 123<br />Sao Paulo - SP</p>
        <p><Phone size={14} /> (11) 9999-9999</p>
        <p><Mail size={14} /> contato@shirtstore.com</p>
      </div>
      <small>© 2026 ShirtStore. Todos os direitos reservados.</small>
    </footer>
  );
}

function CheckoutPage() {
  const [deliveryMode, setDeliveryMode] = useState('pickup');
  const [selectedAddress, setSelectedAddress] = useState(checkoutMock.addresses[0]);
  const [addressListOpen, setAddressListOpen] = useState(false);
  const [newAddressOpen, setNewAddressOpen] = useState(false);

  const saveAddress = (form) => {
    const address = {
      id: crypto.randomUUID(),
      label: `${form.street}, ${form.number}`,
      details: `${form.cep} - ${form.recipient}`
    };

    checkoutGateway.saveAddress(address);
    setSelectedAddress(address);
    setNewAddressOpen(false);
    setAddressListOpen(false);
  };

  return (
    <main className="page">
      <Header />
      <div className="checkoutLayout">
        <div className="checkoutColumn">
          <Section number="1" title="dados pessoais">
            <PersonalData customer={checkoutMock.customer} />
          </Section>
          <Section number="2" title="dados de pagamento">
            <PaymentData payment={checkoutMock.payment} />
          </Section>
          <Section number="3" title="entrega">
            <DeliveryData
              mode={deliveryMode}
              setMode={setDeliveryMode}
              pickup={checkoutMock.pickup}
              selectedAddress={selectedAddress}
              onOpenAddressList={() => setAddressListOpen(true)}
            />
          </Section>
        </div>
        <OrderSummary order={checkoutMock.order} />
      </div>
      <Footer />

      {addressListOpen && (
        <AddressListModal
          addresses={checkoutMock.addresses}
          onClose={() => setAddressListOpen(false)}
          onCreate={() => {
            setAddressListOpen(false);
            setNewAddressOpen(true);
          }}
          onSelect={(address) => {
            setSelectedAddress(address);
            setAddressListOpen(false);
          }}
        />
      )}

      {newAddressOpen && (
        <NewAddressModal
          onClose={() => setNewAddressOpen(false)}
          onSave={saveAddress}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<CheckoutPage />);
