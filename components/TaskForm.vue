<script setup lang="ts">

interface TodoProps {
    task_name: string;
    description: string;
    starts_at: string;
    ends_at: string;
    btnLabel: string;
}

const props: TodoProps = defineProps({
    task_name: {
        type: String,
        required: true,
        default: ''
    },
    description: {
        type: String,
        required: true,
        default: ''
    },
    starts_at: {
        type: String,
        required: true,
        default: ''
    },
    ends_at: {
        type: String,
        required: true,
        default: ''
    },
    btnLabel: {
        type: String,
        required: true,
        default: ''
    }
})
const emit = defineEmits(['submit', 'cancel'])

const data = ref({
    task_name: props.task_name,
    description: props.description,
    starts_at: props.starts_at,
    ends_at: props.ends_at
})

async function submitForm() {
    console.log('data: ',data.value)
    emit('submit', data.value)
    emit('cancel')
}
function closeModal() {
    emit('cancel')
}

</script>
<template>
    <form @submit.prevent="submitForm">
        <BaseInput
            label="Task Name"
            type="text"
            v-model="data.task_name"
        />
        <TextArea 
            label="Description"
            v-model="data.description"
        />
        <div class="flex justify-between flex-row mt-3 w-[365px]">
            <DateInput 
                label="Start Date"
                v-model="data.starts_at"
            />
            <DateInput 
                label="End Date"
                v-model="data.ends_at"
            />
        </div>
        <div class="flex justify-end w-[365px] mt-5 gap-3 items-center py-2">
            <div @click="closeModal" class="">
                <h4 class="text-[12px] text-slate-400 underline cursor-pointer hover:text-slate-600">Cancel</h4>
            </div>
            <div class="rounded-[20px] items-center w-[64px] h-[20px] bg-[#26A69A] justify-center flex cursor-pointer p-3">
                <button class="text-[12px] text-white" type="submit">{{ btnLabel }}</button>
            </div>
        </div>
    </form>
</template>