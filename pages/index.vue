<script setup lang="ts">
import { useTodoListStore } from '~/store/TodoList';
import { formatDate } from '~/helpers/dateFormatter'
import { timeDiff } from '~/helpers/timeDifference'

const store = useTodoListStore()

const isLoading = ref<Boolean>(false)
const isOpen = ref<any>(false)
const isOpenDeleteModal = ref<any>(false)
const isOpenUpdateModal = ref<any>(false)
const isOpenSelect = ref<Boolean>(false)
const taskId = ref<any>(null)
const sortKey = ref<String>('task_name')
const sortValue = ref<String>('ASC')
const page = ref<any>(1)
const pageSize = ref<any>(5)
const totalData = ref<Number>(0)
const task_name = ref<any>('')
const description = ref<any>('')
const starts_at = ref<any>('')
const ends_at = ref<any>('')

async function getTask() {
  isLoading.value = true
  try {
    const response: any = await $fetch('https://ejhu9jgcxd.execute-api.us-east-1.amazonaws.com/sandbox/task/list', {
    method: 'post',
    body: {
      page: page.value,
      pageSize: pageSize.value,
      returnCount: true,
      notEqualFilters: [
        {
          key: "status",
          value: "deleted"
        }
      ],
      sorts: {
        key: sortKey.value,
        value: sortValue.value
      }
    }
  })
  totalData.value = response.data.total
  store.updateList(response.data)
}catch(err){
console.log(err)
}finally {
  isLoading.value = false
}
}

onMounted(async() =>{
  await getTask()
})

const pageCounterIncrement = computed(() => page.value + 1)
const pagecounterDecrement = computed(() => page.value - 1)
async function nextPage(){
  page.value++
  await getTask()
  console.log(page.value)
}
async function prevPage(){
  page.value--
  if(page.value <= 0){
    return page.value = 1
  }
  await getTask()
  console.log(page.value)
}

function openDeleteModal(id: any){
  isOpenDeleteModal.value = true
  taskId.value = id
  console.log(taskId.value)
}
async function openUpdateModal(id: any){
  taskId.value = id
  
  try {
    const fetchedTask: any = await $fetch(`https://ejhu9jgcxd.execute-api.us-east-1.amazonaws.com/sandbox/task/get/${id}`)
     task_name.value = fetchedTask.data.task_name
     description.value = fetchedTask.data.description
     starts_at.value = fetchedTask.data.starts_at
     ends_at.value = fetchedTask.data.ends_at
     isOpenUpdateModal.value = true
    console.log('task form: ', task_name.value, description.value, starts_at.value, ends_at.value)
  }catch(err){
    console.log(err)
  }
  // isOpenUpdateModal.value = true
  // taskId.value = id
}
function closeDeleteModal(){
  isOpenDeleteModal.value = false
}
function closeUpdateModal(){
  isOpenUpdateModal.value = false
}

function toggleDropdown() {
  isOpenSelect.value = !isOpenSelect.value
}
function openModal() {
  isOpen.value = true
}
function closeModal() {
  isOpen.value = false
}
function updateIsDelete(value: boolean){
  isOpenDeleteModal.value = value
}
function updateIsUpdate(value: boolean){
  isOpenUpdateModal.value = value
}
function updateIsCreate(value: boolean) {
  isOpen.value = value
}

async function addTask(data: any){
  isLoading.value = true
  try {
      const response: any = await $fetch('https://ejhu9jgcxd.execute-api.us-east-1.amazonaws.com/sandbox/task/create', {
          method: 'post',
          body: {
            task_name: data.task_name,
            description: data.description,
            starts_at: data.starts_at,
            ends_at: data.ends_at
          }
      })
      console.log("data sent: ",response.data)
      await getTask()
    }catch(err: any){
        console.log("error: ",err.message)
    }finally{
      isLoading.value = false
    }
}
async function deleteTask() {
  isLoading.value = true
  closeDeleteModal()
  try{
    const response = await $fetch(`https://ejhu9jgcxd.execute-api.us-east-1.amazonaws.com/sandbox/task/delete/${taskId.value}`, {
    method: 'put'
  })
  await getTask()
  
  }catch(err){
    console.log('error: ', err)
  }finally {
    isLoading.value = false
  }
}
async function sortBy(key: any, value: any){
  sortKey.value = key
  sortValue.value = value
  await getTask()
}
async function submitUpdate(task: any){
  isLoading.value = true
  try{
    const editedTask = await $fetch(`https://ejhu9jgcxd.execute-api.us-east-1.amazonaws.com/sandbox/task/update/${taskId.value}`, {
      method: 'put',
      body: {
        task_name: task.task_name,
        description: task.description,
        starts_at: task.starts_at,
        ends_at: task.ends_at
      }
    })
    await getTask()
    closeUpdateModal()
    console.log('editted data: ', editedTask)
  }catch(err){
    console.log('submit edit error: ', err)
  }finally {
    isLoading.value = false
  }
}
function cancelUpdateForm(){
  isOpenUpdateModal.value = false
}
</script>
<template>
  <div class="mt-2 px-5">
    <Modal :isOpen="isOpen" @update:is-open="updateIsCreate" title="Create Task">
      <TaskForm
          btnLabel="Create"
          @submit="addTask"
          @cancel="closeModal"
      />
    </Modal>
    <Modal :isOpen="isOpenDeleteModal" @update:is-open="updateIsDelete" title="Delete Task">
      <p class="mt-5">Are you sure you want to delete this task?</p>
      <div class="container mt-5">
        <div class="flex justify-end p-2 gap-2">
          <div class="cursor-pointer" @click="closeDeleteModal">
            <h1 class="underline text-slate-400 hover:text-slate-500">cancel</h1>
          </div>
          <div class="flex cursor-pointer h-[25px] w-[70px] rounded-[20px] justify-center bg-red-700" @click="deleteTask">
            <h1 class="text-white">delete</h1>
          </div>
        </div>
      </div>
    </Modal>
    <Modal :is-open="isOpenUpdateModal" @update:is-open="updateIsUpdate" title="Edit Task">
      <TaskForm 
          v-model:task_name="task_name"
          v-model:description="description"
          v-model:starts_at="starts_at"
          v-model:ends_at="ends_at"
          btnLabel="Save"
          @cancel="cancelUpdateForm"
          @submit="submitUpdate"
      />
    </Modal>
      <div class="h-[70px] shadow-lg mb-[10px] flex items-center px-4">
        <h1 class="text-lg font-bold w-[220px]">To-Do List</h1>
        <div class=" w-full flex justify-end gap-2">
          <div class="relative" id="dropdownButton" >
            <div @click="toggleDropdown" class="flex items-center h-[36px] w-[112px] outline outline-1 outline-[#1976D2] gap-1 py-[4px] px-[16px] rounded-[36px] cursor-pointer">
            <span class="text-[#1976D2] font-bold text-sm">Sort By</span>
            <Icon name="ic:baseline-keyboard-arrow-down" color="#1976D2" size="25"/>
          </div>
          <div v-if="isOpenSelect" class="absolute flex-col h-[158px] drop-shadow-lg bg-white w-[160px] mt-[5px] rounded">
            <div @click="sortBy('task_name', 'ASC')" class="hover:text-[#1976D2] cursor-pointer hover:bg-slate-100 h-[40px] items-center p-[10px] text-[12px] text-justify">Task Name: A - Z</div>
            <div @click="sortBy('task_name', 'DESC')" class="hover:text-[#1976D2] cursor-pointer hover:bg-slate-100 h-[40px] items-center p-[10px] text-[12px] text-justify">Task Name: Z - A</div>
            <div @click="sortBy('createdAt', 'ASC')" class="hover:text-[#1976D2] cursor-pointer hover:bg-slate-100 h-[40px] items-center p-[10px] text-[12px] text-justify">Date Created: ASC</div>
            <div @click="sortBy('createdAt', 'DESC')" class="hover:text-[#1976D2] cursor-pointer hover:bg-slate-100 h-[40px] items-center p-[10px] text-[12px] text-justify">Date Created: DESC</div>
          </div>
          </div>
          <div @click="openModal" class="flex items-center h-[36px] w-[112px] gap-1 bg-[#1976D2] py-[4px] px-[16px] rounded-[36px] :hover cursor-pointer">
            <Icon name="ic:round-plus" color="white"/>
            <span class="text-white text-sm font-bold">Add Task</span>
          </div>
        </div>
      </div>
      <div class="flex justify-center w-full">
        <Spinner :isLoading="isLoading"/>
      </div>
      <!-- <div>
        {{ store.list }}
      </div> -->
      <div class="container mx-auto shadow-lg">
        <table class="w-[100%]">
          <thead>
            <tr
              class="bg-[#1D50A2] text-white text-left text-[14px] font-semibold"
            >
              <th class="px-4 py-2 w-[241px] h-[50px]">Task Name</th>
              <th class="px-4 py-2 w-[336px] h-[50px]">Description</th>
              <th class="px-4 py-2 w-[146px] h-[50px]">Time Left</th>
              <th class="px-4 py-2 w-[189px] h-[50px]">Start Date</th>
              <th class="px-4 py-2 w-[189px] h-[50px]">End Date</th>
              <th class="px-4 py-2 w-[189px] h-[50px]">Created At</th>
              <th class="px-4 py-2 w-[101px] h-[50px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(todo, index) in store.list.records" :key="index" class="border-b-2">
              <td class="px-4 py-2 h-[54px] text-justify text-[14px]">
                 {{ todo.task_name }}
              </td>
              <td class="px-4 py-2 text-justify text-[14px]">
                {{ todo.description }}
              </td>
              <td class="px-4 py-2 text-[14px]">
               {{ timeDiff(todo.starts_at, todo.ends_at).days }} days,
               {{ timeDiff(todo.starts_at, todo.ends_at).hours }} hours,
               {{ timeDiff(todo.starts_at, todo.ends_at).minutes }} mins.
              </td>
              <td class="px-4 py-2 text-[14px]">{{ formatDate(todo.starts_at) }}</td>
              <td class="px-4 py-2 text-[14px]">{{ formatDate(todo.ends_at) }}</td>
              <td class="px-4 py-2 text-[14px]">{{ formatDate(todo.createdAt) }}</td>
              <td class="px-4 py-2 text-[14px]">
                <div class="flex gap-2">
                  <button @click="openDeleteModal(todo.id)">
                    <Icon name="ic:round-delete" size="24" color="gray" />
                  </button>
                  <button @click="openUpdateModal(todo.id)">
                    <Icon name="ic:baseline-edit" size="24" color="gray" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <tfoot class="flex h-[50px] justify-end gap-5 items-center px-5">
            <span class="text-[12px]">Rows per page: </span>
            <span class="text-[12px]">5</span>
            <span class="text-[12px]">1-{{ totalData }} of {{ totalData }}</span>
            <div @click="prevPage" class="cursor-pointer"> 
              <Icon name="ic:baseline-arrow-back-ios"/>
            </div>
            <div @click="nextPage" class="cursor-pointer">
              <Icon name="ic:baseline-arrow-forward-ios"/>
            </div>
            
        </tfoot>
      </div>
    </div>
</template>
