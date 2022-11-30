<template>
    <div class="login-container">
        <van-nav-bar title="登录" class="page-nav-bar"/>
        <van-form ref="loginForm" @submit="onSubmit">
            <van-field
                v-model="user.mobile"
                name="mobile"
                placeholder="请输入手机号"
                type="number"
                maxlength="11"
                :rules="userFormRules.mobile"
            >
                <i slot="left-icon" class="toutiao toutiao-shouji"></i>
            </van-field>
            <van-field
                v-model="user.code"
                name="code"
                placeholder="请输入验证码"
                type="number"
                maxlength="6"
                :rules="userFormRules.code"
            >
                <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
                <template #button>
                    <van-count-down :time="1000*60" format="ss s" v-if="isCountDownShow" @finish="isCountDownShow = false"/>
                    <van-button v-else native-type="button" round class="send-sms-btn" size="small" type="default" @click="onSendSms">发送验证码</van-button>
                </template>
            </van-field>
            <div class="login-btn-wrap">
                <van-button class="login-btn" block type="info" native-type="submit">登陆</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号码不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号码格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false
    }
  },

  mounted () {

  },

  methods: {
    async onSubmit () {
      const user = this.user
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登陆成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机或验证码错误')
          console.log('手机或验证码错误')
        } else {
          this.$toast.fail('登陆失败')
          console.log('登陆失败', err)
        }
      }
    },
    async onSendSms () {
      this.$toast.loading({
        message: '验证中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        this.$toast.fail('验证失败')
        return console.log(err)
      }
      this.isCountDownShow = true

      try {
        const res = await sendSms(this.user.mobile)
        console.log(res)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          console.log(err)
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
    .toutiao {
        font-size: 37px;
    }
    .send-sms-btn {
        width: 180px;
        height: 46px;
        line-height: 46px;
        background-color: #ededed;
        .van-button__text {
            font-size: 22px;
            color: #666;
        }
    }
    .login-btn-wrap {
        padding: 53px 33px;
        .login-btn {
            background-color: #6db4fb;
            border: none;
        }
    }
}
</style>
