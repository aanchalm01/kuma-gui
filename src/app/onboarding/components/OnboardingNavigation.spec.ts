import { RouterLinkStub } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'

import OnboardingNavigation from './OnboardingNavigation.vue'
import { store, storeKey } from '@/store/store'

function renderComponent(props: any) {
  return render(OnboardingNavigation, {
    props,
    global: {
      plugins: [[store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
      mocks: {
        $router: {
          push: () => undefined,
        },
      },
    },
  })
}

describe('OnboardingNavigation.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
    })

    expect(container).toMatchSnapshot()
  })

  it('displays different next step title', () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
      nextStepTitle: 'nextStepTitle',
    })

    expect(screen.getByText(/nextStepTitle/)).toBeInTheDocument()
  })

  it('display disabled next button', () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
      shouldAllowNext: false,
    })

    expect(screen.getByText(/Next/).closest('a')).toHaveAttribute('disabled')
  })

  it('doesn\'t display previous step', () => {
    renderComponent({
      nextStep: 'bar',
    })

    expect(screen.queryByText(/Back/)).not.toBeInTheDocument()
  })

  it('changes step to previous', async () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
    })

    expect(store.state.onboarding.step).toBe('onboarding-welcome')

    await userEvent.click(screen.getByText(/Back/))

    expect(store.state.onboarding.step).toBe('foo')
  })

  it('calls skip onboarding', async () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
    })

    expect(store.state.onboarding.isCompleted).toBe(false)

    await userEvent.click(screen.getByText(/Skip Setup/))

    expect(store.state.onboarding.isCompleted).toBe(true)
  })
})