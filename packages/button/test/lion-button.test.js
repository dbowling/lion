/* eslint-disable lit-a11y/click-events-have-key-events */
import { browserDetection } from '@lion/core';
import {
  aTimeout,
  expect,
  fixture,
  oneEvent,
  html,
  unsafeStatic,
  defineCE,
} from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { LionButton, LionButtonBase, LionButtonReset } from '@lion/button';
import sinon from 'sinon';
import '@lion/core/differentKeyEventNamesShimIE';
// import '@lion/button/define';

// TODO: three suites
const tagStringButtonBase = defineCE(class extends LionButtonBase {});
const tagStringButtonReset = defineCE(class extends LionButtonReset {});
const tagStringButton = defineCE(class extends LionButton {});

const tagButtonBase = unsafeStatic(tagStringButtonBase);
const tagButtonReset = unsafeStatic(tagStringButtonReset);
const tagButton = unsafeStatic(tagStringButton);

describe('lion-input', () => {
  describe('LionButtonBase', () => {
    it('has .type="button" and type="button" by default', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        html`<${tagButtonBase}>foo</${tagButtonBase}>`,
      ));
      expect(el.type).to.equal('button');
      expect(el.getAttribute('type')).to.be.equal('button');
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        html`<${tagButtonBase} hidden>foo</${tagButtonBase}>`,
      ));
      expect(el).not.to.be.displayed;
    });

    it('can be disabled imperatively', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        html`<${tagButtonBase} disabled>foo</${tagButtonBase}>`,
      ));
      expect(el.getAttribute('tabindex')).to.equal('-1');
      expect(el.getAttribute('aria-disabled')).to.equal('true');

      el.disabled = false;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('0');
      expect(el.getAttribute('aria-disabled')).to.equal('false');
      expect(el.hasAttribute('disabled')).to.equal(false);

      el.disabled = true;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('-1');
      expect(el.getAttribute('aria-disabled')).to.equal('true');
      expect(el.hasAttribute('disabled')).to.equal(true);
    });

    describe('Active', () => {
      it('updates "active" attribute on host when mousedown/mouseup on button', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}`,
        ));
        el.dispatchEvent(new Event('mousedown'));

        expect(el.active).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.true;

        el.dispatchEvent(new Event('mouseup'));
        expect(el.active).to.be.false;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.false;
      });

      it('updates "active" attribute on host when mousedown on button and mouseup anywhere else', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));

        el.dispatchEvent(new Event('mousedown'));
        expect(el.active).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.true;

        document.dispatchEvent(new Event('mouseup'));
        expect(el.active).to.be.false;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.false;
      });

      it('updates "active" attribute on host when space keydown/keyup on button', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));

        el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        expect(el.active).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.true;

        el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        expect(el.active).to.be.false;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.false;
      });

      it('updates "active" attribute on host when space keydown on button and space keyup anywhere else', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));

        el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        expect(el.active).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.true;

        el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        expect(el.active).to.be.false;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.false;
      });

      it('updates "active" attribute on host when enter keydown/keyup on button', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));

        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.active).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.true;

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        expect(el.active).to.be.false;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.false;
      });

      it('updates "active" attribute on host when enter keydown on button and space keyup anywhere else', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));

        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.active).to.be.true;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.true;

        document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        expect(el.active).to.be.false;
        await el.updateComplete;
        expect(el.hasAttribute('active')).to.be.false;
      });
    });

    describe('Accessibility', () => {
      it('has a role="button" by default', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('role')).to.equal('button');
        el.setAttribute('role', 'foo');
        await el.updateComplete;
        expect(el.getAttribute('role')).to.equal('foo');
      });

      it('does not override user provided role', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase} role="foo">foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('role')).to.equal('foo');
      });

      it('has a tabindex="0" by default', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('tabindex')).to.equal('0');
      });

      it('has a tabindex="-1" when disabled', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase} disabled>foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('tabindex')).to.equal('-1');
        el.disabled = false;
        await el.updateComplete;
        expect(el.getAttribute('tabindex')).to.equal('0');
        el.disabled = true;
        await el.updateComplete;
        expect(el.getAttribute('tabindex')).to.equal('-1');
      });

      it('does not override user provided tabindex', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase} tabindex="5">foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('tabindex')).to.equal('5');
      });

      it('disabled does not override user provided tabindex', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase} tabindex="5" disabled>foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('tabindex')).to.equal('-1');
        el.disabled = false;
        await el.updateComplete;
        expect(el.getAttribute('tabindex')).to.equal('5');
      });

      it('has an aria-labelledby and wrapper element in IE11', async () => {
        const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));
        expect(el.hasAttribute('aria-labelledby')).to.be.true;
        const wrapperId = el.getAttribute('aria-labelledby');
        expect(/** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`#${wrapperId}`)).to.exist;
        expect(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`#${wrapperId}`),
        ).dom.to.equal(`<div class="button-content" id="${wrapperId}"><slot></slot></div>`);
        browserDetectionStub.restore();
      });

      it('does not override aria-labelledby when provided by user', async () => {
        const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase} aria-labelledby="some-id another-id">foo</${tagButtonBase}>`,
        ));
        expect(el.getAttribute('aria-labelledby')).to.equal('some-id another-id');
        browserDetectionStub.restore();
      });

      it('[axe] is accessible', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase}>foo</${tagButtonBase}>`,
        ));
        await expect(el).to.be.accessible();
      });

      it('[axe] is accessible when disabled', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<${tagButtonBase} disabled>foo</${tagButtonBase}>`,
        ));
        await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] });
      });
    });

    describe('Click event', () => {
      /**
       * @param {HTMLButtonElement | LionButton} el
       */
      async function prepareClickEvent(el) {
        setTimeout(() => {
          el.click();
        });
        return oneEvent(el, 'click');
      }

      it('is fired once', async () => {
        const clickSpy = /** @type {EventListener} */ (sinon.spy());
        const el = /** @type {LionButton} */ (await fixture(
          html` <${tagButtonBase} @click="${clickSpy}">foo</${tagButtonBase}> `,
        ));

        el.click();

        // trying to wait for other possible redispatched events
        await aTimeout(0);
        await aTimeout(0);

        expect(clickSpy).to.have.been.calledOnce;
      });

      describe('Native button behavior', async () => {
        /** @type {Event} */
        let nativeButtonEvent;
        /** @type {Event} */
        let lionButtonEvent;

        before(async () => {
          const nativeButtonEl = /** @type {LionButton} */ (await fixture('<button>foo</button>'));
          const lionButtonEl = /** @type {LionButton} */ (await fixture(
            html`<${tagButtonBase}>foo</${tagButtonBase}>`,
          ));
          nativeButtonEvent = await prepareClickEvent(nativeButtonEl);
          lionButtonEvent = await prepareClickEvent(lionButtonEl);
        });

        const sameProperties = [
          'constructor',
          'composed',
          'bubbles',
          'cancelable',
          'clientX',
          'clientY',
        ];

        sameProperties.forEach(property => {
          it(`has same value of the property "${property}" as in native button event`, () => {
            expect(lionButtonEvent[property]).to.equal(nativeButtonEvent[property]);
          });
        });
      });

      describe('Event target', async () => {
        it('is host by default', async () => {
          const el = /** @type {LionButton} */ (await fixture(
            html`<${tagButtonBase}>foo</${tagButtonBase}>`,
          ));
          const event = await prepareClickEvent(el);
          expect(event.target).to.equal(el);
        });

        const useCases = [
          { container: 'div', type: 'submit' },
          { container: 'div', type: 'reset' },
          { container: 'div', type: 'button' },
          { container: 'form', type: 'submit' },
          { container: 'form', type: 'reset' },
          { container: 'form', type: 'button' },
        ];

        useCases.forEach(useCase => {
          const { container, type } = useCase;
          const targetName = 'host';
          it(`is ${targetName} with type ${type} and it is inside a ${container}`, async () => {
            const clickSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
            const el = /** @type {LionButton} */ (await fixture(
              html`<${tagButtonBase} type="${type}">foo</${tagButtonBase}>`,
            ));
            const tag = unsafeStatic(container);
            await fixture(html`<${tag} @click="${clickSpy}">${el}</${tag}>`);
            const event = await prepareClickEvent(el);

            expect(event.target).to.equal(el);
          });
        });
      });
    });

    describe('With click event', () => {
      it('behaves like native `button` when clicked', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <${tagButtonBase} @click="${formButtonClickedSpy}" type="submit">foo</${tagButtonBase}>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector(tagStringButtonBase));
        button.click();

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard space', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <${tagButtonBase} @click="${formButtonClickedSpy}" type="submit">foo</${tagButtonBase}>
          </form>
        `);

        const lionButton = /** @type {LionButton} */ (form.querySelector(tagStringButtonBase));
        lionButton.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard enter', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <${tagButtonBase} @click="${formButtonClickedSpy}" type="submit">foo</${tagButtonBase}>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector(tagStringButtonBase));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });
    });
  });

  describe('LionButtonReset', () => {
    it('has .type="reset" and type="reset" by default', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        html`<${tagButtonReset}>foo</${tagButtonReset}>`,
      ));
      expect(el.type).to.equal('reset');
      expect(el.getAttribute('type')).to.be.equal('reset');
    });

    /**
     * Notice functionality below is not purely for type="reset", also for type="submit".
     * For mainainability purposes the submit functionality is part of LionButtonReset.
     * (it needs the same logic)
     * LionButtonReset could therefore actually be considered as 'LionButtonForm' (without the
     * implicit form submission logic), but LionButtonReset is an easier to grasp name for
     * Application Developers: for reset buttons, always use LionButtonReset, for submit
     * buttons always use LionButton.
     * For buttons that should support all three types (like native <button>); use LionButton.
     */
    describe('Form integration', () => {
      describe('With submit event', () => {
        it('behaves like native `button` when clicked', async () => {
          const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <${tagButtonReset} type="submit">foo</${tagButtonReset}>
            </form>
          `);
          const button /** @type {LionButton} */ = /** @type {LionButton} */ (form.querySelector(
            tagStringButtonReset,
          ));
          button.click();
          expect(formSubmitSpy).to.have.been.calledOnce;
        });

        it('behaves like native `button` when interacted with keyboard space', async () => {
          const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <${tagButtonReset} type="submit">foo</${tagButtonReset}>
            </form>
          `);
          const button /** @type {LionButton} */ = /** @type {LionButton} */ (form.querySelector(
            tagStringButtonReset,
          ));
          button.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
          await aTimeout(0);
          await aTimeout(0);
          expect(formSubmitSpy).to.have.been.calledOnce;
        });

        it('behaves like native `button` when interacted with keyboard enter', async () => {
          const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <${tagButtonReset} type="submit">foo</${tagButtonReset}>
            </form>
          `);

          const button = /** @type {LionButton} */ (form.querySelector(tagStringButtonReset));
          button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
          await aTimeout(0);
          await aTimeout(0);

          expect(formSubmitSpy).to.have.been.calledOnce;
        });

        it('supports resetting form inputs in a native form', async () => {
          const form = await fixture(html`
            <form>
              <input name="firstName" />
              <input name="lastName" />
              <${tagButtonReset} type="reset">reset</${tagButtonReset}>
            </form>
          `);
          const btn /** @type {LionButton} */ = /** @type {LionButton} */ (form.querySelector(
            tagStringButtonReset,
          ));
          const firstName = /** @type {HTMLInputElement} */ (form.querySelector(
            'input[name=firstName]',
          ));
          const lastName = /** @type {HTMLInputElement} */ (form.querySelector(
            'input[name=lastName]',
          ));
          firstName.value = 'Foo';
          lastName.value = 'Bar';

          expect(firstName.value).to.equal('Foo');
          expect(lastName.value).to.equal('Bar');

          btn.click();

          expect(firstName.value).to.be.empty;
          expect(lastName.value).to.be.empty;
        });
      });
    });

    it('is fired once outside and inside the form', async () => {
      const outsideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const insideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyEarly = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyLater = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));

      const el = /** @type {HTMLDivElement} */ (await fixture(
        html`
            <div @click="${outsideSpy}">
              <form @click="${formSpyEarly}">
                <div @click="${insideSpy}">
                  <${tagButtonReset}>foo</${tagButtonReset}>
                </div>
              </form>
            </div>
          `,
      ));
      const lionButton = /** @type {LionButton} */ (el.querySelector(tagStringButtonReset));
      const form = /** @type {HTMLFormElement} */ (el.querySelector('form'));
      form.addEventListener('click', formSpyLater);

      lionButton.click();
      // trying to wait for other possible redispatched events
      await aTimeout(0);
      await aTimeout(0);

      expect(insideSpy).to.have.been.calledOnce;
      expect(outsideSpy).to.have.been.calledOnce;
      // A small sacrifice for event listeners registered early: we get the native button evt.
      expect(formSpyEarly).to.have.been.calledTwice;
      expect(formSpyLater).to.have.been.calledOnce;
    });

    it('works when connected to different form', async () => {
      const form1El = /** @type {HTMLFormElement} */ (await fixture(
        html`
            <form>
              <${tagButtonReset}>foo</${tagButtonReset}>
            </form>
          `,
      ));
      const lionButton = /** @type {LionButton} */ (form1El.querySelector(tagStringButtonReset));

      expect(lionButton._form).to.equal(form1El);

      // Now we add the lionButton to a different form.
      // We disconnect and connect and check if everything still works as expected
      const outsideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const insideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyEarly = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyLater = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));

      const form2El = /** @type {HTMLFormElement} */ (await fixture(
        html`
          <div @click="${outsideSpy}">
            <form @click="${formSpyEarly}">
              <div @click="${insideSpy}">${lionButton}</div>
            </form>
          </div>
        `,
      ));
      const form2Node = /** @type {HTMLFormElement} */ (form2El.querySelector('form'));

      expect(lionButton._form).to.equal(form2Node);

      form2Node.addEventListener('click', formSpyLater);
      lionButton.click();
      // trying to wait for other possible redispatched events
      await aTimeout(0);
      await aTimeout(0);

      expect(insideSpy).to.have.been.calledOnce;
      expect(outsideSpy).to.have.been.calledOnce;
      // A small sacrifice for event listeners registered early: we get the native button evt.
      expect(formSpyEarly).to.have.been.calledTwice;
      expect(formSpyLater).to.have.been.calledOnce;
    });
  });

  describe('LionButton', () => {
    it('has .type="submit" and type="submit" by default', async () => {
      const el = /** @type {LionButton} */ (await fixture(html`<${tagButton}>foo</${tagButton}>`));
      expect(el.type).to.equal('submit');
      expect(el.getAttribute('type')).to.be.equal('submit');
    });

    describe('Implicit form submission', () => {
      describe('Helper submit button', () => {
        it('creates a helper submit button when type is "submit"', async () => {
          let lionBtnEl;
          const elTypeSubmit = /** @type {HTMLFormElement} */ (await fixture(
            html`<form><${tagButton} type="submit">foo</${tagButton}></form>`,
          ));
          lionBtnEl = /** @type {LionButton} */ (elTypeSubmit.querySelector('[type=submit]'));
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode instanceof HTMLButtonElement).to.be.true;
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode.type).to.equal('submit');

          const elTypeReset = /** @type {LionButton} */ (await fixture(
            html`<form><${tagButton} type="reset">foo</${tagButton}></form>`,
          ));
          lionBtnEl = /** @type {LionButton} */ (elTypeReset.querySelector('[type=reset]'));
          console.log('lionBtnEl', lionBtnEl);
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode).to.be.null;

          const elTypeButton = /** @type {LionButton} */ (await fixture(
            html`<form><${tagButton} type="button">foo</${tagButton}></form>`,
          ));

          lionBtnEl = /** @type {LionButton} */ (elTypeButton.querySelector('[type=button]'));
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode).to.be.null;
        });

        it('only creates a helper submit button when LionButton is inside a form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (await fixture(html`<form></form>`));
          const el = /** @type {LionButton} */ (await fixture(
            html`<${tagButton} type="submit">foo</${tagButton}>`,
          ));
          // @ts-ignore [allow-protected] in test
          expect(el._nativeButtonNode).to.be.null;

          elForm.appendChild(el);
          await el.updateComplete;
          // @ts-ignore [allow-protected] in test
          expect(el._nativeButtonNode).to.be.not.null;

          elForm.removeChild(el);
          // @ts-ignore [allow-protected] in test
          expect(el._nativeButtonNode).to.be.null;
        });

        it('puts helper submit button at the bottom of a form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (await fixture(
            html`<form><input /><${tagButton} type="submit">foo</${tagButton}><input /></form>`,
          ));
          const lionBtnEl = /** @type {LionButton} */ (elForm.querySelector('[type=submit]'));
          expect(elForm.children.length).to.equal(4); // 3 + 1
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode).to.be.not.null;
          // @ts-ignore [allow-protected] in test
          expect(elForm.children[3]).to.equal(lionBtnEl._nativeButtonNode);
        });

        it('creates max one helper submit button per form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (await fixture(
            html`<form>
              <input /><${tagButton} type="submit">foo</${tagButton}
              ><${tagButton} type="submit">foo</${tagButton}><input />
            </form>`,
          ));
          const [lionBtnEl1, lionBtnEl2] = /** @type {LionButton[]} */ (Array.from(
            elForm.querySelectorAll('[type=submit]'),
          ));
          const { children } = elForm;
          expect(children.length).to.equal(5); // 4 + 1
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl1._nativeButtonNode).to.be.not.null;
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl2._nativeButtonNode).to.be.not.null;
          // @ts-ignore [allow-protected] in test
          expect(children[children.length - 1]).to.equal(lionBtnEl1._nativeButtonNode);
          // @ts-ignore [allow-protected] in test
          expect(children[children.length - 1]).to.equal(lionBtnEl2._nativeButtonNode);
        });

        it.skip('helper submit button gets reconnected when external context changes (rerenders)', async () => {
          const elForm = /** @type {HTMLFormElement} */ (await fixture(
            html`<form><${tagButton} type="submit">foo</${tagButton}></form>`,
          ));
          const lionBtnEl = /** @type {LionButton} */ (elForm.querySelector('[type=submit]'));
          const helperBtnEl = elForm.children[elForm.children.length - 1];
          elForm.removeChild(helperBtnEl);
          expect(elForm.children[elForm.children.length - 1]).to.equal(lionBtnEl);
          // Wait for MutationObserver and reconnection
          await aTimeout(0);
          expect(elForm.children[elForm.children.length - 1]).to.equal(helperBtnEl);
        });

        it('helper submit button gets removed when last Lionbutton gets disconnected from form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (await fixture(
            html`<form><${tagButton} type="submit">foo</${tagButton}></form>`,
          ));
          const lionBtnEl = /** @type {LionButton} */ (elForm.querySelector('[type=submit]'));
          const { children } = elForm;
          // @ts-ignore [allow-protected] in test
          expect(children[children.length - 1]).to.equal(lionBtnEl._nativeButtonNode);
        });

        it('hides the helper submit button in the UI', async () => {
          const el = /** @type {LionButton} */ (await fixture(
            html`<form><${tagButton}>foo</${tagButton}></form>`,
          ));
          // @ts-ignore [allow-protected] in test
          const helperButtonEl = el.querySelector(tagStringButton)._nativeButtonNode;
          expect(helperButtonEl.getAttribute('tabindex')).to.equal('-1');
          expect(window.getComputedStyle(helperButtonEl).clip).to.equal('rect(0px, 0px, 0px, 0px)');
        });
      });

      // TODO: find out how to use sendKeys
      it.skip('works with implicit form submission on-enter inside an input', async () => {
        const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
        const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <input name="foo" />
              <input name="foo2" />
              <${tagButton} type="submit">foo</${tagButton}>
            </form>
          `);

        const input2 = /** @type {HTMLInputElement} */ (form.querySelector('input[name="foo2"]'));
        input2.focus();
        await sendKeys({
          press: 'Enter',
        });
        expect(formSubmitSpy).to.have.been.calledOnce;
      });
    });

    describe('Accessibility', () => {
      it('the helper button has aria-hidden set to true', async () => {
        const el = /** @type {LionButton} */ (await fixture(
          html`<form><${tagButton}></${tagButton}></form>`,
        ));
        // @ts-ignore [allow-protected] in test
        const helperButtonEl = el.querySelector(tagStringButton)._nativeButtonNode;
        expect(helperButtonEl.getAttribute('aria-hidden')).to.equal('true');
      });
    });
  });
});
