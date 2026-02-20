import { App } from '@openedx/frontend-base';
import { appId } from './constants';
import routes from './routes';
import providers from './providers';
import messages from './i18n';
import slots from './slots';

const app: App = {
  appId,
  routes,
  providers,
  messages,
  slots,
  config: {
    CONTACT_URL: null,
    CREDENTIALS_BASE_URL: null,
    CREDIT_HELP_LINK_URL: null,
    DISCUSSIONS_MFE_BASE_URL: null,
    DISCOUNT_CODE_INFO_URL: null,
    ENTERPRISE_LEARNER_PORTAL_HOSTNAME: null,
    ENTERPRISE_LEARNER_PORTAL_URL: null,
    ENABLE_JUMPNAV: null,
    ENABLE_NOTICES: null,
    INSIGHTS_BASE_URL: null,
    SEARCH_CATALOG_URL: null,
    SOCIAL_UTM_MILESTONE_CAMPAIGN: null,
    STUDIO_BASE_URL: null,
    SUPPORT_URL: null,
    SUPPORT_URL_CALCULATOR_MATH: null,
    SUPPORT_URL_ID_VERIFICATION: null,
    SUPPORT_URL_VERIFIED_CERTIFICATE: null,
    TERMS_OF_SERVICE_URL: null,
    TWITTER_HASHTAG: null,
    TWITTER_URL: null,
    LEGACY_THEME_NAME: null,
    EXAMS_BASE_URL: null,
    PROCTORED_EXAM_FAQ_URL: null,
    PROCTORED_EXAM_RULES_URL: null,
    CHAT_RESPONSE_URL: null,
    PRIVACY_POLICY_URL: null,
    SHOW_UNGRADED_ASSIGNMENT_PROGRESS: false,
    ENABLE_XPERT_AUDIT: false,
  },
};

export default app;


