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
        variant="outlined"
        hide-details
      >
      </v-autocomplete>
    </v-col>
    <v-col cols="1">
      <v-icon-btn
        icon="mdi-reload"
        :disabled="currentState === 'NO_STUDENT'"
        @click="cancel"
      />
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col
      class="border-thin border-secondary h-40 d-flex align-center justify-center mb-4"
      :class="{
        'border-opacity': currentState === 'NO_STUDENT',
        'border-opacity-50': currentState === 'WAITING_CARD',
        'border-opacity-100': currentState === 'DESCRIPTION',
        'text-gray-300': currentState === 'NO_STUDENT',
        'text-gray-500': currentState === 'WAITING_CARD',
        'text-gray-800': currentState === 'DESCRIPTION'
      }"
      cols="6"
    >
      {{ statusMessages[currentState] }}
      <div v-if="currentState === 'DESCRIPTION'">
        <v-icon-btn icon="mdi-check" color="secondary" variant="text" :loading="confirmLoading" @click="confirm" />
        <v-icon-btn icon="mdi-close" variant="text" :disabled="confirmLoading" @click="cancel" />
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <h3><b>How to assign a card?</b></h3>

      <v-list>
        <v-list-item>
          <template #prepend>
            <v-chip color="secondary" variant="elevated"> 1 </v-chip>
          </template>
          <div class="ml-2">
            Select a student by clicking Search Student. You can type using the keyboard
            for easily searching by name or IST-ID.
          </div>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-chip color="secondary" variant="elevated"> 2 </v-chip>
          </template>
          <div class="ml-2">Ask for the student to scan the card he wants to assign.</div>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-chip color="secondary" variant="elevated"> 3 </v-chip>
          </template>
          <div class="ml-2">
            Confirm by clicking the <v-icon>mdi-check</v-icon> button.
          </div>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-chip color="secondary" variant="elevated"> 4 </v-chip>
          </template>
          <div class="ml-2">
            Student can now scan that card to register entry/exit automatically.
          </div>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col>
      <h3><b>Supported Cards</b></h3>

      <v-list>
        <v-list-item>
          <template #prepend>
            <v-chip color="secondary" variant="elevated" />
          </template>
          <div class="ml-2">Técnico Satander Card</div>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-chip color="secondary" variant="elevated" />
          </template>
          <div class="ml-2">ULisboa Card</div>
        </v-list-item>
      </v-list>

      <div class="ml-2">
        While other cards may function, compatibility is not guaranteed. To verify support,
        simply have the student scan their card; if the system recognizes it, the card is compatible.
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Student } from '@lemac/data-model/browser';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
import { assignStudentCard } from '@/api/students.api.ts';
import { notify } from '@kyvg/vue3-notification';

defineProps<{
  students: Student[]
}>();

const selectedStudent = ref<number | null>(null);
const cardScanned = ref<bigint | null>(null);

let socket: Socket;

onMounted(() => {
  const token = localStorage.getItem('token');

  socket = io(import.meta.env.VITE_BASE_URL_WS || 'http://localhost:5000', {
    path: "/api/socket.io",
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
  notify({
    type: 'success',
    title: 'Card assigned',
    text: `Card assigned to student (ID: ${selectedStudent.value})`,
  });
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