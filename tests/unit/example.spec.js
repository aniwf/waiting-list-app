import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import Form from '@/components/Form.vue'

describe('App.vue', () => {
  it('calls a method on the child component', async () => {
    const wrapper = mount(App)
    const form = wrapper.findComponent(Form);
    
    form.setData({email: 'sofyan@gmail.com', refer:'O201aY'})
    //refer = O201aY belongs to loha@gmail.com

    await form.vm.onSubmit();
    const result = await wrapper.vm.getWaitingList();
    var referUser = result.find(obj => obj.email === 'aniwahdah@gmail.com');
  
    const newUser = result[result.length-1];
    console.log(result[result.length-1]);

    if(expect(newUser.email).toBe("sofyan@gmail.com")){
      expect(referUser.order).toBe(1);
    }
  })
})
