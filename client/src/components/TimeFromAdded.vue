<template>
  <div>{{ getDate }}</div>
</template>

<script>
export default {
  name: "TimeFromAdded",
  props: ["date"],
  data() {
    return {
      now: new Date(),
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  computed: {
    getDate() {
      const d = new Date(this.date);
      const { now } = this;
      const minutes = (now - d) / 1000 / 60;
      const roudedMin = Math.round(minutes);
      if (roudedMin < 60) {
        if (roudedMin <= 1) return `1 minutę temu`;
        if (roudedMin < 5) return `${roudedMin} minuty temu`;
        return `${roudedMin} minut temu`;
      }

      const hours = minutes / 60;
      const roundedHours = Math.round(hours);
      if (roundedHours < 24) {
        if (roudedDays == 1) return `1 godzinę temu`;
        if (roudedDays < 5) return `${roudedDays} godziny temu`;
        return `${roundedHours} godzin temu`;
      }

      const days = hours / 24;
      const roudedDays = Math.round(days);
      if (roudedDays < 31) {
        if (roudedDays == 1) return `1 dzień temu`;
        return `${roudedDays} dni temu`;
      }

      const months = days / 30.4368;
      const roudedMonths = Math.round(months);
      if (roudedMonths <= 12) {
        if (roudedMonths == 1) return `1 miesiąc temu`;
        if (roudedMonths < 5) return `${roundedMonths} miesiące temu`;
        return `${roudedMonths} miesięcy temu`;
      }

      const years = days / 365;
      const roundedYears = Math.round(years);
      if (roundedYears == 1) return `1 rok temu`;
      if (roundedYears < 5) return `${roundedYears} lata temu`;
      return `${roundedYears} lat temu`;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  color: $gray;
  font-size: 13px;
}
</style>