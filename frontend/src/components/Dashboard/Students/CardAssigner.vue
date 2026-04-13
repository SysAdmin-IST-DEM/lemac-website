<template>
  <v-row>
    <v-col>
      <h2 class="text-2xl text-center">Assign a Card</h2>
    </v-col>
  </v-row>
  <v-row
    justify="center"
    align="center"
  >
    <v-col cols="6">
      <v-autocomplete
        v-model="selectedStudent"
        label="Search Student"
        :items="students.map(s => ({title: `${s.name} (${s.istId})`, value: s.id}))"
        :disabled="currentState !== 'NO_STUDENT'"
        hide-details
      >
      </v-autocomplete>
    </v-col>
    <v-col cols="1">
      <v-icon-btn
        icon="mdi-reload"
        @click="cancel"
      />
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col
      class="border-1 border-solid h-40 d-flex align-center justify-center mb-4"
      :class="{
        'border-gray-300': currentState === 'NO_STUDENT',
        'border-gray-500': currentState === 'WAITING_CARD',
        'border-gray-800': currentState === 'DESCRIPTION',
        'text-gray-300': currentState === 'NO_STUDENT',
        'text-gray-500': currentState === 'WAITING_CARD',
        'text-gray-800': currentState === 'DESCRIPTION'
      }"
      cols="6"
    >
      {{ statusMessages[currentState] }}
      <div v-if="currentState === 'DESCRIPTION'">
        <v-icon-btn icon="mdi-check" :loading="confirmLoading" @click="confirm" />
        <v-icon-btn icon="mdi-close" :disabled="confirmLoading" @click="cancel" />
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Student } from '@lemac/data-model/browser';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
import { assignStudentCard } from '@/api/students.api.ts';

defineProps<{
  students: Student[]
}>();

const selectedStudent = ref<number | null>(null);
const cardScanned = ref<bigint | null>(null);

let socket: Socket;

onMounted(() => {
  const token = localStorage.getItem('token');

  socket = io(import.meta.env.VITE_BASE_URL_WS || 'http://localhost:5000', {
    auth: {
      token: token
    }
  });

  console.log("Socket started", socket)

  socket.on('card-scanned', (data) => {
    socket.emit('stop-assigning');
    cardScanned.value = data.mifareNumber;
  });
});

onUnmounted(() => {
  if (socket) {
    socket.emit('stop-assigning');
    socket.disconnect();
  }
});

watch(selectedStudent, () => {
  if(selectedStudent.value !== null) {
    socket.emit('start-assigning', { studentId: selectedStudent.value });
  }
})

const confirmLoading = ref(false);

async function confirm() {
  confirmLoading.value = true;
  await assignStudentCard(selectedStudent.value!, cardScanned.value!);
  confirmLoading.value = false;
  cancel();
}

function cancel() {
  socket.emit('stop-assigning');
  selectedStudent.value = null;
  cardScanned.value = null;
}

const currentState = computed(() => {
  if(selectedStudent.value === null) {
    return "NO_STUDENT";
  } else {
    if(cardScanned.value) {
      return "DESCRIPTION";
    } else {
      return "WAITING_CARD";
    }
  }
})

const statusMessages = {
  NO_STUDENT: 'Select a Student to start',
  WAITING_CARD: 'Waiting for card...',
  DESCRIPTION: 'Card Scanned. Confirm?'
};

</script>

<style scoped>

</style>