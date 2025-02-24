<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">

            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :pageSize="page.size" :viewFunc="handleView"
                :delFunc="handleDelete" :changePage="changePage" :currentPage="page.index" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
                <template #permissions="{ rows }">
                    <el-button type="primary" size="small" plain @click="handlePermission(rows)">管理</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData">
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </TableDetail>
        </el-dialog>
        <el-dialog title="权限管理" v-model="visible2" width="500px" destroy-on-close>
            <RolePermission :permiss-options="permissOptions" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-role">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Role } from '@/types/role';
// import { fetchRoleData } from '@/api';
import {fetchRoleDataApi,fetchRoleAddApi,fetchRoleUpdateApi,fetchRoleDeleteApi} from '@/api/fetch/index'
import {FetchRoleRequestData} from '@/api/fetch/types/fetch'
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import RolePermission from './role-permission.vue'
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = ref({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '角色名称：', prop: 'name' }
])
const handleSearch = () => {
    changePage(1);
    
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'name', label: '角色名称' },
    { prop: 'key', label: '角色标识' },
    { prop: 'status', label: '状态' },
    { prop: 'permissions', label: '权限管理' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    index: 1,
    size: 5,
    total: 0,
})
const tableData = ref<Role[]>([]);
const getData = async () => {
    const res = await fetchRoleDataApi({...query.value,'page':page.index})
    console.log("角色",res);
    tableData.value =res.data.list
    page.total = res.data.pageTotal
    // const res = await fetchRoleData()
    // tableData.value = res.data.list;
    // page.total = res.data.pageTotal;
}
getData();
const changePage = (val: number) => {
    console.log("hahahah",val);
    page.index = val;
    getData();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
    labelWidth: '100px',
    span: 24,
    list: [
        { type: 'input', label: '角色名称', prop: 'name', required: true },
        { type: 'input', label: '角色标识', prop: 'key', required: true },
        { type: 'switch', label: '状态', prop: 'status', required: false, activeText: '启用', inactiveText: '禁用' },
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<any>({});
const handleEdit = (row: Role) => {
    // console.log("点击",row);
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};
const updateData = async (data:FetchRoleRequestData) => {
    // console.log("新增hahaah",isEdit.value);
    // console.log("iddd",rowData.value.id);
    if (isEdit.value){
        await fetchRoleUpdateApi(data,rowData.value.id)
    }else{
        await fetchRoleAddApi(data)
    }
    closeDialog();
    getData();
};
const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
    rowData.value = {};
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: [],
    column: 1
});
const handleView = (row: Role) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'id',
            label: '角色ID',
        },
        {
            prop: 'name',
            label: '角色名称',
        },
        {
            prop: 'key',
            label: '角色标识',
        },
        {
            prop: 'status',
            label: '角色状态',
        },
    ]
    visible1.value = true;
};

// 删除相关
const handleDelete = async (row: Role) => {
    // console.log("删除",row);
    await fetchRoleDeleteApi(row.id)
    ElMessage.success('删除成功');
    getData()
}


// 权限管理弹窗相关
const visible2 = ref(false);
const permissOptions = ref({})
const handlePermission = (row: Role) => {
    console.log("变化",row);
    
    visible2.value = true;
    permissOptions.value = {
        id: row.id,
        // permiss: row.permiss
        permiss:[0,1,12,13]
    };
}
</script>

<style scoped></style>