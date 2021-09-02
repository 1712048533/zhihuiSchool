<template>
  <view class="workItem-view">
      <view v-show="oprType==='create'" class="workItem-view_create">
          
          <uni-forms ref="createForm">
              <uni-forms-item required label="房间类型" name="roomType">
                  <uni-data-checkbox v-model="formData.roomType" :localdata="[{value: 0,text: '直播室'},{value: 1,text: '会议室'}]"/>
              </uni-forms-item>
              <uni-forms-item required label="开始时间" name="startTime">
                    <uni-datetime-picker v-model="formData.startTime" :start="minStartTime" end="2099-12-12 23:59:59" @change="changeTime"/>
              </uni-forms-item>
              <uni-forms-item required label="结束时间" name="endTime">
                    <uni-datetime-picker v-model="formData.endTime" :start="minEndTime" end="2099-12-12 23:59:59" @change="changeTime"/>
              </uni-forms-item>
              <uni-forms-item required label="录屏功能" name="isCanRecord">
                    <uni-data-checkbox v-model="formData.isCanRecord" :localdata="[{value: 1,text: '允许'},{value: 0,text: '禁止'}]"/>
              </uni-forms-item>
              <uni-forms-item required label="说明" name="roomName">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.roomName" placeholder="请输入内容"></uni-easyinput>
              </uni-forms-item>
              
              <button class="default_form_button" form-type="submit" @click="createWorkRoom">完成创建</button>
          </uni-forms>
      </view>

      <view v-show="oprType==='search'" class="workItem-view_create">
    
      </view>

      <view v-show="oprType==='update'" class="workItem-view_create">

      </view>
      <!-- 时间验证时候的弹窗 -->
      <uni-popup
          ref="timePopup"
          type="dialog"
      >
        <uni-popup-dialog
            :type="timeVailFlag===true?'success':'error'"
            :content = "timeErrorTp"
            mode="base"
            @confirm="timeConfirm"
        />
      </uni-popup>
  </view>
</template>

<script>
    import dayjs from 'dayjs'
    export default {
        data(){
            return {
                oprType:'',
                roomId:'',
                minStartTime:'',
                minEndTime:'',
                formData:{
                    roomType:0,
                    roomName:'',
                    startTime:'',
                    endTime:'',
                    isCanRecord:0
                },
                //最少时间间隔，设置为5分钟
                minTimeMinute:5,
                //时间不合法时的提示信息
                timeErrorTp:'',
                //时间合法标志,默认时间是合法的
                timeVailFlag:true,
            }
        },

        onLoad(options) {
            this.oprType = options.oprType;
            this.initTime();
        },

        watch:{
            'fromData.startTime'(newVal,oldVal){
                this.minEndTime = dayjs(newVal).add(this.minTimeMinute,'minute').format('YYYY-MM-DD HH:mm:ss');
            },
            deep:true
        },

        methods:{

            // 初始化选择的开始时间与结束时间
            initTime(){
                // 必须约束选择的最早时间。
                let now_time = dayjs(`${new Date()}`);
                this.minStartTime = now_time.format('YYYY-MM-DD HH:mm:ss');
                //直播（会议）开始时间与结束时间间隔最少为5分钟
                this.minEndTime = now_time.add(this.minTimeMinute,'minute').format('YYYY-MM-DD HH:mm:ss');
                //时间初始化
                this.formData.startTime = this.minStartTime;
                this.formData.endTime = this.minEndTime;
            },

            // 校验数据
            vailDateTime(){
                // 开始时间晚于结束时间
                let min_res = dayjs(this.formData.endTime).diff(dayjs(this.formData.startTime),'minute');
                if(min_res<0){
                    this.timeErrorTp = "非法选择：结束时间不能早于开始时间";
                    return false;
                }
                // 开始时间到结束时间间隔过短
                else if(min_res<this.minTimeMinute){
                    this.timeErrorTp = `时间间隔设置应该不小于${this.minTimeMinute}分钟`;
                    return false;
                }
                return true;
                
            },

            // 创建workRoom，逻辑较为复杂,roomId是后端创建，我们不需要关注
            createWorkRoom(){
                //校验输入框是否合法
                if(this.formData.roomName.trim().length === 0){
                    this.timeErrorTp="说明内容框应填入1到150个字符，不允许内容为空、过长或者全为空白符";
                    this.timeVailFlag = false;
                    this.$refs.timePopup.open();
                    return;
                }
                // 校验时间是否合法
                if((this.timeVailFlag = this.vailDateTime())===false){
                    this.$refs.timePopup.open();
                    return;
                }
                HWH5.showLoading();
                uni.request({
                    url: 'http://localhost:8081/createWork',
                    data: {
                        roomType:this.formData.roomType,
                        workName:this.formData.roomName,
                        creatorId:'admin_ysj367635984',
                        creatorName:'ysj',
                        isCanRecord:this.formData.isCanRecord,
                        startTime:this.formData.startTime,
                        endTime:this.formData.endTime
                    },
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    method: 'POST',
                    success: ({ data, statusCode, header }) => {
                        console.log(data)
                        if(data === 'success'){
                            this.timeErrorTp = "创建成功，是否返回上一页面"
                            this.$refs.timePopup.open();
                        }
                    },
                    fail: (error) => {
                        HWH5.hideLoading();
                        HWH5.showToast({ msg: '未知异常', type: 'w' });
                        return;
                    },
                })
                
            },
            
            updateWorkRoom(){

            },

            //如果时间合法，则跳回上一个页面，如果不合法，则继续处于该页面
            timeConfirm(){
                if(this.timeVailFlag===true){
                    uni.navigateBack({ delta: 1 })
                }
            },

        }
    }
</script>

<style>
    .workItem-view{
        display: flex;
        display: -webkit-flex;
        justify-content: center;
    }
    .workItem-view_create{
        width: 95%;
        margin-top: 60rpx;
    }
</style>