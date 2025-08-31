<template>
  <div class="home-page">
    <div>
      <h2 class='text-dark'>Main Control Panel</h2>
    </div>
    <div v-if="loading" class="loading-state">Loading Dashboard Data...</div>
    <div v-else class="dashboard-card">
      <div class="profile-section">
        <img src="../assets/profile-photo.jpg" alt="User Avatar" class="avatar">
        <div class="profile-info">
          <span class="role">Administrator</span>
          <span class="name">Milyaz Kamil</span>
        </div>
      </div>
      <div class="stat-circle-group">
        <div class="stat-circle">
          <svg viewBox="0 0 36 36">
            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="circle" :stroke-dasharray="`${stats.templateProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="stat-label">Total Templates</div>
          <div class="stat-value-fraction">
            <span>{{ stats.templateCount }}</span>
            <span class="divider">/</span>
            <span>{{ stats.templateGoal }}</span>
          </div>
        </div>
        <div class="stat-circle">
          <svg viewBox="0 0 36 36">
             <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="circle purple" :stroke-dasharray="`${stats.emailProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="stat-label">Emails Sent</div>
          <div class="stat-value-fraction">
            <span>{{ stats.emailCount }}</span>
            <span class="divider">/</span>
            <span>{{ stats.emailGoal }}</span>
          </div>
        </div>
      </div>
      <div class="stat-bar-group">
        <div class='d-flex gap-5'>
          <div class="stat-bar-item">
            <span class="bar bar-red"></span>
            <span class="label">Total Templates</span>
            <span class="value">{{ stats.templateCount }}</span>
          </div>
          <div class="stat-bar-item">
            <span class="bar bar-blue"></span>
            <span class="label">Total Emails Sent</span>
            <span class="value">{{ stats.emailCount }}</span>
          </div>
        </div>
        <div class='d-flex gap-5'>
          <div class="stat-bar-item">
            <span class="bar bar-green"></span>
            <span class="label">AI Conversations</span>
            <span class="value">{{ stats.conversationCount }}</span>
          </div>
          <div class="stat-bar-item">
            <span class="bar bar-purple"></span>
            <span class="label">Last Activity</span>
            <span class="value">{{ stats.lastActivity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HomePage',
  computed: {
    ...mapState('dashboard', {
      stats: state => state.stats,
      loading: state => state.loading,
    }),
  },
  created() {
    this.$store.dispatch('dashboard/fetchDashboardData');
  },
}
</script>

<style scoped>
.home-page {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.dashboard-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}
.profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.profile-info {
  display: flex;
  flex-direction: column;
}
.role {
  font-size: 0.875rem;
  color: #6b7280;
}
.name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}
.stat-circle-group {
  display: flex;
  gap: 3rem;
  flex-grow: 1;
  justify-content: center;
}
.stat-circle {
  position: relative;
  width: 170px;
  height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stat-circle svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.circle-bg {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 3.8;
}
.circle {
  fill: none;
  stroke: #f97316;
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease-in-out;
}
.circle.purple {
  stroke: #8b5cf6;
}
.stat-label {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.stat-bar-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 200px;
}
.stat-bar-item {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 10px;
}
.bar {
  width: 8px;
  height: 34px;
  border-radius: 100px;
  justify-self: center;
}
.bar-red { background-color: #ef4444; }
.bar-blue { background-color: #3b82f6; }
.bar-green { background-color: #22c55e; }
.bar-purple { background-color: #a855f7; }
.label {
  font-size: 0.875rem;
  color: #4b5563;
}
.value {
  font-size: 1rem;
  font-weight: 600;
}
.stat-value-fraction {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.stat-value-fraction .divider {
  font-size: 1rem;
  font-weight: 400;
  color: #9ca3af;
}
</style>