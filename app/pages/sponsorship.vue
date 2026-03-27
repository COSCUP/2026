<script setup lang="ts">
import { TierLevelSchema } from '#shared/types/sponsorship'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '~/utils/renderMarkdown'

const { t, locale } = useI18n()

const { data: tiers } = await useFetch('/api/sponsorship/tiers')
const { data: addOns } = await useFetch('/api/sponsorship/add-ons')

const tierLevels = TierLevelSchema.options
const regularTiers = computed(() =>
  tiers.value?.filter((tier) => tier.method === 'amount') ?? [],
)
const communityTier = computed(() =>
  tiers.value?.find((tier) => tier.level === 'community'),
)

</script>

<template>
  <div class="mx-auto px-4 py-8 max-w-5xl prose">
    <h1 class="text-center">
      {{ t('title') }}
    </h1>

    <h2>{{ t('overview.heading') }}</h2>
    <p>{{ t('overview.desc') }}</p>
    <p>{{ t('overview.feedback') }}</p>
    <ul>
      <li>{{ t('overview.stat1') }}</li>
      <li>{{ t('overview.stat2') }}</li>
      <li>{{ t('overview.stat3') }}</li>
    </ul>

    <!-- Sponsorship Tiers -->
    <h2>{{ t('tiers.heading') }}</h2>

    <!-- Top 3 tiers: titanium, diamond, gold -->
    <table>
      <thead>
        <tr>
          <th />
          <th
            v-for="level in tierLevels.slice(0, 3)"
            :key="level"
            class="text-center"
          >
            {{ t(`levels.${level}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{ t('tiers.amount') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(0, 3)"
            :key="tier.level"
          >
            <strong>{{ tier.value[locale] }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>{{ t('tiers.benefits') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(0, 3)"
            :key="tier.level"
            v-html="renderMarkdown(tier.benefits[locale])"
          />
        </tr>
      </tbody>
    </table>

    <!-- Bottom 3 tiers: silver, bronze, friend -->
    <table>
      <thead>
        <tr>
          <th />
          <th
            v-for="level in tierLevels.slice(3)"
            :key="level"
            class="text-center"
          >
            {{ t(`levels.${level}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{ t('tiers.amount') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(3)"
            :key="tier.level"
          >
            <strong>{{ tier.value[locale] }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>{{ t('tiers.benefits') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(3)"
            :key="tier.level"
            v-html="renderMarkdown(tier.benefits[locale])"
          />
        </tr>
      </tbody>
    </table>

    <!-- Community custom plan -->
    <table v-if="communityTier">
      <thead>
        <tr>
          <th />
          <th class="text-center">
            {{ t('levels.community') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{ t('tiers.method') }}</strong></td>
          <td>
            <strong>{{ communityTier.value[locale] }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>{{ t('tiers.benefits') }}</strong></td>
          <td v-html="renderMarkdown(communityTier.benefits[locale])" />
        </tr>
      </tbody>
    </table>

    <!-- Add-ons -->
    <h2>{{ t('addons.heading') }}</h2>

    <table>
      <thead>
        <tr>
          <th>{{ t('addons.item') }}</th>
          <th
            v-for="level in tierLevels"
            :key="level"
            class="text-center"
          >
            {{ t(`levels.${level}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(addon, idx) in addOns"
          :key="idx"
        >
          <td v-html="renderMarkdown(addon.item[locale])" />
          <td
            v-for="level in tierLevels"
            :key="level"
            class="text-center"
          >
            <strong>{{ addon[`${level}_amount`][locale] }}</strong>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Deadline & Contact -->
    <p>
      {{ t('deadline') }}
    </p>
    <p>
      {{ t('contact') }}
      <NuxtLink to="mailto:sponsorship@coscup.org">
        sponsorship@coscup.org
      </NuxtLink>
    </p>

    <!-- FAQ -->
    <h2>{{ t('faq.heading') }}</h2>

    <h3>{{ t('faq.custom.q') }}</h3>
    <ul>
      <li>{{ t('faq.custom.a') }}</li>
    </ul>

    <h3>{{ t('faq.booth.q') }}</h3>
    <ul>
      <li>{{ t('faq.booth.a') }}</li>
    </ul>

    <h3>{{ t('faq.logo.q') }}</h3>
    <ul>
      <li>{{ t('faq.logo.a') }}</li>
    </ul>

    <h3>{{ t('faq.pii.q') }}</h3>
    <ul>
      <li>{{ t('faq.pii.a') }}</li>
    </ul>

    <h3>{{ t('faq.brochure.q') }}</h3>
    <ul>
      <li>{{ t('faq.brochure.a') }}</li>
    </ul>

    <h3>{{ t('faq.refund.q') }}</h3>
    <ul>
      <li>{{ t('faq.refund.a') }}</li>
    </ul>

    <h3>{{ t('faq.ocf.q') }}</h3>
    <ul>
      <li>{{ t('faq.ocf.a') }}</li>
    </ul>

    <!-- About COSCUP -->
    <h2>{{ t('about.heading') }}</h2>
    <p>{{ t('about.desc') }}</p>
    <ul>
      <li>{{ t('about.point1') }}</li>
      <li>{{ t('about.point2') }}</li>
      <li>{{ t('about.point3') }}</li>
    </ul>

    <h2>{{ t('wishes.heading') }}</h2>
    <ul>
      <li>{{ t('wishes.point1') }}</li>
      <li>{{ t('wishes.point2') }}</li>
      <li>{{ t('wishes.point3') }}</li>
      <li>{{ t('wishes.point4') }}</li>
      <li>{{ t('wishes.point5') }}</li>
    </ul>

    <p>
      {{ t('contact') }}
      <NuxtLink to="mailto:sponsorship@coscup.org">
        sponsorship@coscup.org
      </NuxtLink>
    </p>
  </div>
</template>

<i18n lang="yaml">
zh:
  title: "COSCUP 2026 贊助方案"
  overview:
    heading: "總覽"
    desc: "COSCUP 過去三年平均約有超過 3,000 人次的會眾和超過 20 個開源技術或議題社群一同參與，同時也有與超過 7 個國際的開源社群或組織連結合作。"
    feedback: "COSCUP 2024 會眾問卷回饋："
    stat1: "7 成以上之與會者為資訊背景"
    stat2: "6 成以上之與會者為 19 ~ 34 歲"
    stat3: "前五名最常使用的程式語言：Python、C++、JavaScript、Bash/Shell、HTML/CSS"
  tiers:
    heading: "贊助方案（單位：新台幣，外稅）"
    amount: "贊助金額"
    benefits: "贊助福利"
    method: "贊助方式"
  addons:
    heading: "贊助方案加價購（單位：新台幣，外税）"
    item: "加價項目"
  levels:
    titanium: "鈦金級"
    diamond: "鑽石級"
    gold: "黃金級"
    silver: "白銀級"
    bronze: "青銅級"
    friend: "好朋友級"
    community: "贊助社群客製化方案"
  deadline: "因應相關製作物所需的工作時間，贊助截止日期：2026 年 7 月 10 日"
  contact: "聯絡我們："
  faq:
    heading: "常見問答"
    custom:
      q: "除了目前的贊助方案，還可以贊助其他項目嗎？或是不需要某些項目換折扣"
      a: "COSCUP 歡迎洽談客製化贊助方案，請來信聯繫我們：sponsorship{'@'}coscup.org"
    booth:
      q: "我們公司想要在 COSCUP 擺攤位，要選擇哪個贊助級別呢？"
      a: "請選擇「黃金級」、「鑽石級」或「鈦金級」，接著再選擇攤位等級。實體攤位能夠和與會者互動，COSCUP 也會準備活動讓會眾前往各攤位參觀。贊助商可以透過問卷和送贈品等形式更加了解與會者，是招募人才、加深與會者印象的好管道。攤位是加購的熱門選項，但因數量限制，黃金級以上（含）的贊助商才擁有加購攤位的權利。"
    logo:
      q: "贊助單位的 Logo 排序是怎麼訂的？攤位是怎麼選擇的？"
      a: "為了保障贊助商 Logo 位置及公平性，贊助商 Logo 的露出排名和攤位選擇皆是依照「贊助等級」和「贊助款項的入款順序」所決定。以有購買攤位的黃金級贊助商來說，最早入贊助款的贊助商的 logo 排序較優先，亦可優先選擇攤位位置。"
    pii:
      q: "贊助商可以索取參與會眾的個人資料嗎？"
      a: "COSCUP 大會無法提供與會者個人資料給贊助單位。主辦單位同意贊助商在攤位進行行銷、提供紀念品、招募人才，以及在與會者同意的前提下收集會眾的個人資訊。"
    brochure:
      q: "為什麼沒看到實體手冊和迎賓袋置入廣宣物？"
      a: "因應無紙化愛護地球，COSCUP 大會近幾年已使用電子版手冊，會眾將透過網頁和 OPass app 閱讀議程資訊。除「好朋友級」贊助商，其他等級贊助商等級將贈送電子版廣告（按贊助等級比重播出），廣告將在使用者閱讀議程資訊時隨機播放；如需增加廣告露出頻率，也歡迎加購網站議程頁面廣告。"
    refund:
      q: "若有沒使用到的贊助福利，是否可以退款？"
      a: "若當年度沒使用贊助福利（沒提供素材），將視為放棄，無法退款。"
    ocf:
      q: "什麼是 OCF？"
      a: "OCF 為 Open Culture Foundation（財團法人開放文化基金會）的簡稱，是個協助社群獲得行政和財務服務的非營利組織。COSCUP 由「財團法人開放文化基金會（OCF）」協力開立 COSCUP 贊助收據、電子發票、簽訂贊助合約或其他法律文件。"
  about:
    heading: "關於 COSCUP"
    desc: "COSCUP (Conference for Open Source Coders, Users and Promoters；開源人年會)"
    point1: "臺灣最大的年度開源研討會。"
    point2: "自 2006 年以來，由臺灣開源社群所聯合主辦。"
    point3: "我們的使命是為開源人創造一個結交朋友、學習新科技、分享經驗的友善環境。"
  wishes:
    heading: "我們期待所有的贊助單位在 COSCUP 2026 都可以..."
    point1: "激發新的想法、創意。"
    point2: "獲得意想不到的合作計畫。"
    point3: "招募高手級人才加入公司創造更大績效。"
    point4: "擴展開放軟體未來的展望。"
    point5: "與專業人士交流。"
en:
  title: "COSCUP 2026 Sponsorship Program"
  overview:
    heading: "Overview"
    desc: "Over the past three years, COSCUP has consistently attracted over 3,000 participants, with more than 20 open source technology and themed communities coming together every year. Additionally, the event has forged strong collaborations with over 7 international open source communities and organizations."
    feedback: "COSCUP 2024 Feedback Survey:"
    stat1: "More than 70% of the participants have a background in information technology"
    stat2: "More than 60% were aged between 19 and 34"
    stat3: "Top 5 favorite programming languages: Python, C++, JavaScript, Bash/Shell, HTML/CSS"
  tiers:
    heading: "Sponsorship Package (Unit: TWD, tax excluded)"
    amount: "Cost"
    benefits: "Benefits"
    method: "Methods"
  addons:
    heading: "Sponsorship Add-ons (Unit: TWD, tax excluded)"
    item: "Additional Purchase"
  levels:
    titanium: "Titanium"
    diamond: "Diamond"
    gold: "Gold"
    silver: "Silver"
    bronze: "Bronze"
    friend: "Friend"
    community: "Customized Community Sponsorship Program"
  deadline: "Deadline for sponsorship: July 10, 2026"
  contact: "Contact us:"
  faq:
    heading: "FAQ"
    custom:
      q: "Besides the current sponsorship plan, can I sponsor other projects or items?"
      a: "Yes, contact us at sponsorship{'@'}coscup.org to create custom sponsorship packages."
    booth:
      q: "Our company would like to have a booth at COSCUP. Which sponsorship level should we choose?"
      a: "Please choose \"Gold,\" \"Diamond,\" or \"Titanium,\" and then select the booth level. Physical booths allow for interaction with attendees, and COSCUP will also prepare activities for attendees to visit each booth. Sponsors can get to know the attendees better through surveys and giveaways, which is a great way to recruit talents and deepen the impression of attendees. The booth is a popular option for additional purchases. However, due to the limited number of booths, only Gold-level sponsors or above have the right to purchase booths."
    logo:
      q: "How are the logos of the sponsors listed on the website? How are the booths chosen?"
      a: "To ensure the placement of sponsor logos and maintain fairness, the ranking of logo displays and booth selection is determined based on the \"sponsorship level\" and \"the order of sponsorship payments received\". For Gold-level sponsors who have purchased a booth, the logo of the earliest paid sponsor will be ranked first, and the booth location will be selected first."
    pii:
      q: "Can sponsors request the personal information of the participants?"
      a: "COSCUP does not provide personal information of attendees to sponsors. The organizers allow sponsors to conduct marketing activities, distribute souvenirs, recruit talent, and collect attendees' personal information with their consent at the booth."
    brochure:
      q: "Why don't I see a physical brochure or an opportunity to place pamphlets?"
      a: "COSCUP has been going paperless for the past few years. Attendees can access the agenda via the website and OPass app. In addition to the \"Friends\" level of sponsorship, other levels of sponsorship will receive an electronic version of the advertisement, which will be displayed as users browse the agenda. For greater exposure, you are welcome to purchase additional ads on the agenda page of the website."
    refund:
      q: "Can unused sponsorship benefits be refunded?"
      a: "If the sponsorship benefits are not utilized within the year (no materials provided), they will be regarded as relinquished and are non-refundable."
    ocf:
      q: "What's OCF?"
      a: "OCF, short for Open Culture Foundation, is a non-profit organization that helps communities access administrative and financial services. COSCUP is co-organized with the Open Culture Foundation (OCF) to issue sponsorship receipts, electronic invoices, sponsorship contracts, and other legal documents."
  about:
    heading: "About COSCUP"
    desc: "COSCUP (Conference for Open Source Coders, Users and Promoters)"
    point1: "The largest annual open-source conference in Taiwan."
    point2: "Organized by Taiwan's open-source communities since 2006."
    point3: "Our mission is to create a welcoming environment for open-source users and potential users to connect, learn new technical skills, share experiences, and promote open-source collaboration."
  wishes:
    heading: "We wish all the sponsors in COSCUP 2026 would..."
    point1: "Be inspired by new ideas and creativity."
    point2: "Start new collaborative projects."
    point3: "Recruit top talents to join your companies."
    point4: "Expand the vision of the future of open software."
    point5: "Network with professionals."
</i18n>
