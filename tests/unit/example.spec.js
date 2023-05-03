import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  it('check if email has value', async () => {
    const wrapper = mount(App)
    const form = wrapper.getComponent({'name': 'Form'})
    const queue = wrapper.getComponent({'name': 'Queue'})
    form.setData({refer: 'kc03pU', email: 'sofyan@gmail.com' })
    await form.find('#submit').trigger('click')
    console.log(form.find('#submit').exists())

    expect(form.text()).toBe('aniwahdah@gmail.com')
  })
})
