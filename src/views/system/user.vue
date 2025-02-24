<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom
        :columns="columns"
        :tableData="tableData"
        :total="page.total"
        :viewFunc="handleView"
        :delFunc="handleDelete"
        :changePage="changePage"
        :currentPage="page.index"
        :pageSize="page.size"
        :editFunc="handleEdit"
      >
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="visible = true"
            >新增</el-button
          >
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <TableEdit
        :form-data="rowData"
        :options="options"
        :edit="isEdit"
        :update="updateData"
      />
    </el-dialog>
    <el-dialog
      title="查看详情"
      v-model="visible1"
      width="700px"
      destroy-on-close
    >
      <TableDetail :data="viewData"></TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { CirclePlusFilled } from '@element-plus/icons-vue'
import { User } from '@/types/user'
// import { fetchUserData } from '@/api'
import TableCustom from '@/components/table-custom.vue'
import TableDetail from '@/components/table-detail.vue'
import TableSearch from '@/components/table-search.vue'
import { FormOption, FormOptionList } from '@/types/form-option'
import {fetchUserDataApi,fetchUserAddApi,totalRoleApi,fetchUserEditApi,fetchUserDeleteApi} from '@/api/fetch/index'
import { onMounted } from 'vue'


// 传递角色
const roleList = ref<any[]>([])
// 用户对应的角色
const roles = ref<any>()
// 查询相关
const query = ref({
  username: ''
})
const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '用户名：', prop: 'username' }
])
const handleSearch = () => {
  changePage(1)
}
let options = ref<FormOption>()

// 表格相关
let columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'username', label: '用户名' },
  { prop: 'phone', label: '手机号' },
  { prop: 'role', label: '角色' },
  { prop: 'operator', label: '操作', width: 250 }
])
const page = reactive({
  index: 1,
  size: 5,
  total: 0
})
const tableData = ref<User[]>([])
const getData = async () => {
  const res = await fetchUserDataApi({...query.value,'page':page.index})
  
  // roleList.value = roleRes.data.list.map((item)=>{
  //   return {value:item.id,label:item.name}
  // })
  // console.log("角色列表",roleList.value);
  const data = res.data.list.map((item) => {
    const { role_txt:[...role_list], ...res} = item
    // console.log("xxxx",item);
    return {...res,'role':role_list}
    
})
  tableData.value = data
  page.total = res.data.pageTotal;
}
const getRole = async() =>{
  const roleRes = await totalRoleApi()
  const reslist = roleRes.data
  roleList.value = reslist.map((item) => {return {value:item.id,label:item.name}})
  // 新增/编辑弹窗相关
  options.value = {
  labelWidth: '100px',
  span: 12,
  list: [
    { type: 'input', label: '用户名', prop: 'username', required: true },
    { type: 'input', label: '手机号', prop: 'phone', required: true },
    { type: 'input', label: '密码', prop: 'password', required: true },
    { type: 'input', label: '邮箱', prop: 'email', required: true },
    { type: 'select', label: '角色', prop: 'role', required: true, opts:[...roleList.value]}
  ]
}
}

getRole()
getData()


const changePage = (val: number) => {
  page.index = val
  getData()
}

// 新增/编辑弹窗相关
// let options = ref<FormOption>({
//   labelWidth: '100px',
//   span: 12,
//   list: [
//     { type: 'input', label: '用户名', prop: 'username', required: true },
//     { type: 'input', label: '手机号', prop: 'phone', required: true },
//     { type: 'input', label: '密码', prop: 'password', required: true },
//     { type: 'input', label: '邮箱', prop: 'email', required: true },
//     { type: 'select', label: '角色', prop: 'role', required: true, opts:[...roleList.value]}
//     // { type: 'select', label: '角色', prop: 'role', required: true, opts:[{value:'aaa',label:"卡"},{value:'bbbb',label:"东"}]}
//   ]
// })
const visible = ref(false)
const isEdit = ref(false)
const rowData = ref<any>({})
const handleEdit = (row: User) => {
  console.log("haahahah");
  console.log(row);
  rowData.value = { ...row }
  rowData.value['role']=rowData.value['role'].map((item) => {return item.id})
   
  isEdit.value = true
  visible.value = true
}
const updateData = async (data:any) => {
  // const res = await fetchUserAddApi(data)
  // console.log("dddddd",isEdit.value);
  if (isEdit.value){
      await fetchUserEditApi(data,rowData.value.id)
  }else{
    await fetchUserAddApi(data)
  }
  
  closeDialog()
  getData()
}

const closeDialog = () => {
  visible.value = false
  isEdit.value = false
}

// 查看详情弹窗相关
const visible1 = ref(false)
const viewData = ref({
  row: {},
  list: []
})
const handleView = (row: User) => {
  viewData.value.row = { ...row }
  viewData.value.list = [
    {
      prop: 'id',
      label: '用户ID'
    },
    {
      prop: 'username',
      label: '用户名'
    },
    {
      prop: 'password',
      label: '密码'
    },
    {
      prop: 'email',
      label: '邮箱'
    },
    {
      prop: 'phone',
      label: '电话'
    },
    {
      prop: 'role',
      label: '角色'
    },
    {
      prop: 'date',
      label: '注册日期'
    }
  ]
  visible1.value = true
}

// 删除相关
const handleDelete =async (row: User) => {
  await fetchUserDeleteApi(row.id)
  ElMessage.success('删除成功')
  getData()
}
</script>

<style scoped></style>
