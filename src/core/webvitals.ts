import { Metric, onCLS, onFID, onLCP, onTTFB, onINP, onFCP } from 'web-vitals'
import { createApiReporter, getDeviceInfo } from 'web-vitals-reporter'

//前置知识：
// LCP (Largest Contentful Paint)：网页加载速度指标。这个指标实际上是记录页面首屏可见区域中最大元素的呈现时间。
// FID (First Input Delay)：网页可交互指标。其含义就是从用户首次和 Web 应用互动到浏览器实际开始处理事件或者处理脚本，响应用户互动的这段时间。
// CLS (Cumulative Layout Shift)：网页视觉稳定性指标。这个指标更多的是判断用户的视觉上的体验，也就是在浏览器可视区内现有元素发生位置的改变，触发布局偏移，是否影响用户的使用体验。
// FCP (First Contentful Pain)：首次内容绘制。这个指标记录的是页面渲染出来的第一个非空白元素的渲染时间。
// INP (Interaction to Next Paint)：互动响应速度。用来监听用户交互互动到页面响应的延迟时间。如果用户在一个页面内的多次互动，那么 INP 会记录多个指标数据，并以最长延迟时间的那一次互动作为最终值。
// TTI (Time to Interactive)：可交互时间。衡量从网页开始加载到其主要子资源加载完成的时间。从定义上看，这个时间比 FCP 更靠前。（实验性指标）
// TBT (Total Blocking Time)：总阻塞时间。这是一个衡量页面从首次内容绘制（First Contentful Paint, FCP）到交互就绪（Time to Interactive, TTI）这段时间内，所有长任务导致的主线程阻塞总时间的指标。长任务是指执行时间超过 50 毫秒的任务。
// TTFB (Time to First Byte)：首字节时间。从发起请求到浏览器接收到第一个字节的时间间隔。反映了服务器响应的速度，以及网络传输的效率。


const SCORE_RANGE_LCP: [number, number] = [2500, 4500]
const SCORE_RANGE_FID: [number, number] = [100, 300]
const SCORE_RANGE_CLS: [number, number] = [0.1, 0.25]
const SCORE_RANGE_FCP: [number, number] = [1.8, 3]
const SCORE_RANGE_INP: [number, number] = [200, 500]
const SCORE_RANGE_TTFB: [number, number] = [800, 1800]

const score = (value: number, range: [number, number]) => {
  return value < range[0] ? 'good' : value < range[1] ? 'needs improvement' : 'poor'
}

export function generateUniqueId() {
  return `v1-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`
}

function round(val, precision = 0) {
  // @ts-ignore
  return +(Math.round(`${val}e+${precision}`) + `e-${precision}`)
}

export function mapMetric(metric) {
  const isWebVital = ['FCP', 'TTFB', 'LCP', 'CLS', 'FID'].indexOf(metric.name) !== -1;
  return {
    [metric.name]: isWebVital ? round(metric.value, metric.name === 'CLS' ? 4 : 0) : metric.value,
    [`${metric.name}Rating`]: metric.rating
  }
};

const sendToAnalytics = createApiReporter('/analytics', {
  initial: getDeviceInfo(),
  beforeSend: (result) => {
    console.log('beforeSend')
    const { LCP, FID, CLS } = result
    console.info('web-vitals: ', result)
    if (!LCP || !FID || !CLS) return // Core Web Vitals are not supported

    // return extra attributes to merge into the final result
    return {
      LCPScore: score(LCP, SCORE_RANGE_LCP),
      // FIDScore: FID < 100 ? 'good' : FID < 300 ? 'needs improvement' : 'poor',
      FIDScore: score(FID, SCORE_RANGE_FID),
      // CLSScore: CLS < 0.1 ? 'good' : CLS < 0.25 ? 'needs improvement' : 'poor'
      CLSScore: score(CLS, SCORE_RANGE_CLS),
    }
  },
})


export const onVitals = (saveMetric) => {
  console.log('---------------------webvitals setup---------------------')
  onLCP(saveMetric)
  onFID(saveMetric)
  onCLS(saveMetric)
  // onTTFB(saveMetric)
  // onINP(saveMetric)
  // onFCP(saveMetric)
}

export default {}
