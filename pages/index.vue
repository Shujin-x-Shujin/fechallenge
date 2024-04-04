<script setup lang="ts">
import { useTodoListStore } from '~/store/TodoList';
import { formatDate } from '~/helpers/dateFormatter'
import { timeDiff } from '~/helpers/timeDifference'

const store = useTodoListStore()

const isOpen = ref<Boolean>(false)
const isOpenDeleteModal = ref<Boolean>(false)
const isOpenUpdateModal = ref<Boolean>(false)
const isOpenSelect = ref<Boolean>(false)
const taskId = ref(null)
const sortKey = ref<String>('task_name')
const sortValue = ref<String>('ASC')
const page = ref<Number>(1)
const pageSize = ref<Number>(5)

const task_name = ref<String>('')
const description = ref<String>('')
const starts_at = ref<String>('')
const ends_at = ref<String>('')

async function getTask() {
  const response = await $fetch('https://r874r864j1.execute-api.us-east-1.amazonaws.com/sandbox/task/list', {
    method: 'post',
    body: {
      page: page.value,
      pageSize: pageSize.value,
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
  console.log(response)
  store.updateList(response.data)
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

function openDeleteModal(id){
  isOpenDeleteModal.value = true
  taskId.value = id
  console.log(taskId.value)
}
async function openUpdateModal(id){
  taskId.value = id
  
  try {
    const fetchedTask = await $fetch(`https://r874r864j1.execute-api.us-east-1.amazonaws.com/sandbox/task/get/${id}`)
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
function updateIsDelete(value){
  isOpenDeleteModal.value = value
}
function updateIsUpdate(value){
  isOpenUpdateModal.value = value
}
function updateIsCreate(value) {
  isOpen.value = value
}

async function addTask(data){
  try {
      const response = await $fetch('https://r874r864j1.execute-api.us-east-1.amazonaws.com/sandbox/task/create', {
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
    }catch(err){
        console.log("error: ",err.message)
    }
}
async function deleteTask() {
  try{
    const response = await $fetch(`https://r874r864j1.execute-api.us-east-1.amazonaws.com/sandbox/task/delete/${taskId.value}`, {
    method: 'put'
  })
  await getTask()
  }catch(err){
    console.log('error: ', err)
  }
  closeDeleteModal()
}
async function sortBy(key, value){
  sortKey.value = key
  sortValue.value = value
  await getTask()
}
async function submitUpdate(task){
  try{
    const editedTask = await $fetch(`https://r874r864j1.execute-api.us-east-1.amazonaws.com/sandbox/task/update/${taskId.value}`, {
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
  }
}
function cancelUpdateForm(){
  isOpenUpdateModal.value = false
}
</script>
<template>
  <div class="p-[25px]">
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
      <EditTaskForm 
          v-model:task_name="task_name"
          v-model:description="description"
          v-model:starts_at="starts_at"
          v-model:ends_at="ends_at"
          btnLabel="Save"
          @cancel="cancelUpdateForm"
          @submitUpdate="submitUpdate"
      />
    </Modal>
      <div class="h-[70px] shadow-lg mb-[10px] flex items-center p-4">
        <span class="text-lg font-bold fixed">To-Do List</span>
        <div class=" w-full flex justify-end gap-2">
          <div class="relative" id="dropdownButton" >
            <div @click="toggleDropdown()" class="flex items-center h-[36px] w-[112px] outline outline-1 outline-[#1976D2] gap-1 py-[4px] px-[16px] rounded-[36px] cursor-pointer">
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
      <!-- <div>
        {{ store.list }}
      </div> -->
      <div class="container mx-auto shadow-lg">
        <table class="table-auto w-full">
          <thead>
            <tr
              class="bg-[#1D50A2] text-white text-left text-[14px] font-semibold"
            >
              <th class="px-4 py-2 w-[241px]">Task Name</th>
              <th class="px-4 py-2 w-[336px]">Description</th>
              <th class="px-4 py-2 w-[146px]">Time Left</th>
              <th class="px-4 py-2 w-[189px]">Start Date</th>
              <th class="px-4 py-2 w-[189px]">End Date</th>
              <th class="px-4 py-2 w-[189px]">Created At</th>
              <th class="px-4 py-2 w-[101px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr v-for="(todo, index) in store.list.records" :key="index">
              <td>{{ todo.task_name }}</td>
            </tr> -->
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
            <span class="text-[12px]">1-5 of {{ page }}</span>
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
