<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>AB-тестирование</h2>
      <button @click="showABTestForm = true" class="btn btn--primary">
        Создать тест
      </button>
    </div>
    
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Проект</th>
            <th>Трафик %</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="test in abTests" :key="test.id">
            <td>{{ test.id }}</td>
            <td>{{ test.name }}</td>
            <td>{{ getProjectName(test.project) }}</td>
            <td>{{ test.traffic_percentage }}%</td>
            <td>
              <span :class="['status', test.is_active ? 'status--active' : 'status--inactive']">
                {{ test.is_active ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>
              <button @click="editABTest(test)" class="btn btn--small">Редактировать</button>
              <button @click="handleDeleteABTest(test.id)" class="btn btn--small btn--danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useABTestScripts } from '~/scripts/abTests'
import { useProjectScripts } from '~/scripts/projects'

const {
  abTests,
  showABTestForm,
  editingABTest,
  editABTest,
  handleDeleteABTest
} = useABTestScripts()

const { getProjectName } = useProjectScripts()
</script>