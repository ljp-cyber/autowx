'ui';
// let ui, device, toast, log, alert, activity, rawInput, dialogs, confirm, floaty, auto,
//   sleep, files, threads, id, className, input, setText, app, click, currentPackage, random,
//   back, gesture
// --------------------常量--------------------
// 1、单个动作返回成功失败或对象
// 2、组合动作调用单个动作用代理，每个动作失败抛出错误
// 3、组合动作调用已抛出错误的组合动作不代理
const controlNotFoud = '没有找到控件'
const controlCanNotScroll = '控件不可滑动'
const DoubleClickFail = '双击失败'
const clickFail = '点击失败'
const WXNotAtIndex = '不在微信主页'
const WXNotAtDialog = '不是用户对话页'

const color = '#009688'
const filePath = '/sdcard/autojs data/'
const importFolder = '/sdcard/Download/WeiXin/'
const userFileName = 'user.json'
const ignoreUserFileName = 'ignoreUser.json'
const textArrGroupFileName = 'textArrGroup.json'
const parametersFileName = 'parameters.json'
const idsFileName = 'ids.json'
const myPackageName = 'com.tencent.mm'
let textArrFileName = 'textArr.json'

// --------------------参数--------------------
const w = device.width
const h = device.height

let textArrNames = [
  textArrFileName
]

let parameters = {
  aWordWrireTime: 300,
  launchTime: 5000,
  go: 1000,
  saveInterval: 5,
  factor: 1.0,
  msgRecurse: 0,
  // 通用参数
  doubleClickInterval: 140,
  doubleClickTimeDeviation: 50,
  doubleClickAreaDeviation: 5
}

// ---------------------微信数据------------------
let user = {}
let ignoreUser = {
  腾讯新闻: true,
  微信运动: true
}
let textArr = [
  { val: '测试消息1' },
  { val: '测试消息2' },
  { val: '测试消息3' },
  { val: '测试消息4' }
]
let ids = {
  allMsgViewId: 'gik',
  weixinViewId: 'cn_',
  newMsgViewId: 'ga3',
  itemViewId: 'b4r',
  textSoundViewId: 'anc',
  userNameViewId: 'gas'
}
let allMsgView = null
let textSoundView = null
let newMsgView = null
let itemView = null
let userNameView = null
let weixinView = null

let curRunFloaty = null

// let inputView = className('android.widget.ScrollView')
// let sendView = text('发送')
// -------------------------------------------------ui界面---------------------------------------------------------
ui.layout(
  <drawer id='drawer'>
    <vertical>
      <appbar>
        <toolbar id='toolbar' title='示例' />
        <tabs id='tabs' />
      </appbar>
      <viewpager id='viewpager'>
        <vertical>
          <button id='start' text='启动' />
          <button id='stop' text='停止' />
          <button id='init' text='初始化' />
          <button id='closeF' text='关闭悬浮' />
        </vertical>
        <vertical>
          <vertical layout_weight='0.70' h='*'>
            <list id='list'>
              <horizontal>
                <horizontal layout_weight='0.85'>
                  <text id='key' textSize='16sp' textColor='#000000' text='话术:' />
                  <input id='val' text='{{val}}' />
                </horizontal>
                <horizontal layout_weight='0.15'>
                  <button id='deleteItem' text='删除' />
                </horizontal>
              </horizontal>
            </list>
          </vertical>
          <vertical layout_weight='0.3' h='400px'>
            <horizontal layout_weight='0.5'>
              <button id='add' text='添加' />
              <button id='updata' text='保存' />
              <button id='reflesh' text='加载' />
            </horizontal>
            <horizontal layout_weight='0.5'>
              <button id='selTextArrGroup' text='选话术' />
              <button id='addTextArrGroup' text='添加组' />
              <button id='delTextArrGroup' text='删除组' />
              <button id='importTextArrGroup' text='导入组' />
            </horizontal>
          </vertical>
        </vertical>
        <vertical>
          <vertical layout_weight='0.70'>
            <list id='listP'>
              <horizontal>
                <horizontal layout_weight='0.85'>
                  <text id='key' textSize='16sp' textColor='#000000' text='{{toString()}}:' />
                  <input id='val' text='{{parameters[toString()]}}' />
                </horizontal>
              </horizontal>
            </list>
          </vertical>
          <vertical>
            <horizontal layout_weight='0.5'>
              <button id='parSave' text='保存' />
              <button id='parLoad' text='加载' />
            </horizontal>
          </vertical>
        </vertical>
        <vertical>
          <button id='clearAll' text='清空所有缓存' />
          <button id='clearTextArr' text='清空话术' />
          <button id='clearIds' text='清空所有按钮id' />
          <button id='clearUser' text='清空用户记录' />
          <button id='clearIgnoreUser' text='清空忽略名单' />
        </vertical>
      </viewpager>
    </vertical>
    <vertical layout_gravity='left' bg='#ffffff' w='280'>
      <img w='280' h='200' scaleType='fitXY' src='http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg' />
      <list id='menu'>
        <horizontal bg='?selectableItemBackground' w='*'>
          <img w='50' h='50' padding='16' src='{{this.icon}}' tint='{{color}}' />
          <text textColor='black' textSize='15sp' text='{{this.title}}' layout_gravity='center' />
        </horizontal>
      </list>
    </vertical>
  </drawer>
)

// 创建选项菜单(右上角)
ui.emitter.on('create_options_menu', menu => {
  menu.add('设置')
  menu.add('关于')
})
// 监听选项菜单点击
ui.emitter.on('options_item_selected', (e, item) => {
  switch (item.getTitle()) {
    case '设置':
      toast('还没有设置')
      break
    case '关于':
      alert('关于', '联系我79155266@qq.com')
      break
  }
  e.consumed = true
})
activity.setSupportActionBar(ui.toolbar)

// 设置滑动页面的标题
ui.viewpager.setTitles(['主页', '话术设置', '运行参数', '其他功能'])
// 让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager)

// 让工具栏左上角可以打开侧拉菜单
ui.toolbar.setupWithDrawer(ui.drawer)

ui.menu.setDataSource([
  {
    title: '主页',
    icon: '@drawable/ic_android_black_48dp'
  },
  {
    title: '话术设置',
    icon: '@drawable/ic_settings_black_48dp'
  },
  {
    title: '其他功能',
    icon: '@drawable/ic_favorite_black_48dp'
  },
  {
    title: '退出',
    icon: '@drawable/ic_exit_to_app_black_48dp'
  }
])

ui.menu.on('item_click', item => {
  switch (item.title) {
    case '退出':
      ui.finish()
      break
  }
})
// ----------- 参数------------

ui.listP.on('item_bind', function (itemView, itemHolder) {
  itemView.val.addTextChangedListener({
    afterTextChanged: (val) => {
      // myLog(itemHolder.position)
      parameters[Object.keys(parameters)[itemHolder.position]] = parseInt(val.toString())
      // textArr.splice(itemHolder.position, 1,string);
      // log(parameters);
    }
  })
})

ui.parSave.on('click', () => {
  saveMap(parameters, parametersFileName)
  myLog('保存成功', 0)
})

ui.parLoad.on('click', () => {
  parameters = loadObj(parametersFileName)
  ui.listP.setDataSource(Object.keys(parameters))
})

// ------------话术设置------------
ui.list.on('item_bind', function (itemView, itemHolder) {
  itemView.deleteItem.on('click', function () {
    textArr.splice(itemHolder.position, 1)
    myLog('删除成功', 0)
  })
  itemView.val.addTextChangedListener({
    afterTextChanged: (val) => {
      // myLog(itemHolder.position)
      textArr[itemHolder.position].val = val.toString()
      // textArr.splice(itemHolder.position, 1,string);
    }
  })
})

ui.addTextArrGroup.on('click', () => {
  rawInput('请输入文件名', 'textArr.json', (tempFileName) => {
    if (tempFileName == null) return
    tempFileName = tempFileName.toString()
    if (loadObj(tempFileName) != null) {
      myLog('文件已存在，请输入其他名字', 0)
      return
    }
    textArrFileName = tempFileName

    saveObj(textArr, textArrFileName)

    textArrNames = loadObj(textArrGroupFileName)
    myLog(textArrNames)
    textArrNames.push(textArrFileName)
    saveObj(textArrNames, textArrGroupFileName)
    myLog('添加成功', 0)
  })
})

ui.delTextArrGroup.on('click', () => {
  textArrNames = loadObj(textArrGroupFileName)
  const options = textArrNames
  dialogs.select('请选择一个选项', options).then(i => {
    if (i < 0) {
      myLog('您取消了选择')
      return
    }
    textArrNames.splice(i, 1)
    delFile(options[i])
    saveObj(textArrNames, textArrGroupFileName)
    textArrFileName = textArrNames[i - 1 >= 0 ? i - 1 : i + 1]
    myLog('删除成功', 0)
  })
})

ui.selTextArrGroup.on('click', () => {
  textArrNames = loadObj(textArrGroupFileName)
  const options = textArrNames
  dialogs.select('请选择一个选项', options).then(i => {
    if (i < 0) {
      myLog('您取消了选择')
      return
    }
    textArrFileName = options[i]
    textArr = loadObj(textArrFileName)
    ui.list.setDataSource(textArr)
  })
})

ui.importTextArrGroup.on('click', () => {
  const importNames = files.listDir(importFolder, function (name) {
    if (name == null) return false
    if (files.getExtension(name) == 'json') return true
    return false
  })
  dialogs.select('请选择一个选项', importNames).then(i => {
    if (i < 0) {
      myLog('您取消了选择')
      return
    }
    myLog(importFolder + importNames[i] + ',' + filePath + textArrFileName)
    files.copy(importFolder + importNames[i], filePath + textArrFileName)
    textArrNames = loadObj(textArrGroupFileName)
    textArrNames.push(textArrFileName)
    saveObj(textArrNames, textArrGroupFileName)
    textArr = loadObj(textArrFileName)
    textArrFileName = importNames[i]
    myLog('添加成功', 0)
  })
})

ui.reflesh.on('click', () => {
  textArr = loadObj(textArrFileName)
  ui.list.setDataSource(textArr)
})

ui.add.on('click', () => {
  textArr.push({ val: '' })
})

ui.updata.on('click', () => {
  // myLog(JSON.stringify(textArr))
  saveObj(textArr, textArrFileName)
  myLog('修改成功', 0)
})
// -----------主页-----------
let mainThread = null
console.setPosition(w / 2 - 100, h / 2)
console.show()
ui.closeF.on('click', () => {
  floaty.closeAll()
})
ui.start.on('click', () => {
  try {
    if ((mainThread === undefined || mainThread == null)) {
      myLog('正在执行任务，请不要操作，影响运行', 0)
      mainThread = threads.start(start)
    } else {
      myLog('任务已在运行中，请不要重新运行', 0)
    }
  } catch (error) {
    myLog('运行错误，请重新运行，或联系管理员')
  }
})
let initThread = null
ui.init.on('click', () => {
  initThread = threads.start(initData)
})
ui.stop.on('click', () => {
  saveCache()
  try {
    if (mainThread) {
      mainThread.interrupt()
    }
  } catch (e) {
    myLog('退出异常')
  } finally {
    mainThread = null
  }
  try {
    if (initThread)initThread.interrupt()
  } catch (e) {
    myLog('退出异常')
  }
  myLog('任务已停止', 0)
  console.show()
})
// --------------其他功能-------------------
ui.clearAll.on('click', () => {
  confirm('要清除所有缓存吗?', '', function (clear) {
    if (clear) {
      clearCache()
      myLog('ok,请重新初始化', 0)
    }
  })
})
ui.clearIgnoreUser.on('click', () => {
  confirm('要清除忽略用户?', '', function (clear) {
    if (clear) {
      ignoreUser = {}
      saveMap(ignoreUser, ignoreUserFileName)
      myLog('ok', 0)
    }
  })
})
ui.clearUser.on('click', () => {
  confirm('要清除用户记录?', '', function (clear) {
    if (clear) {
      user = {}
      saveMap(user, userFileName)
      myLog('ok', 0)
    }
  })
})
ui.clearTextArr.on('click', () => {
  confirm('要清除话术?', '', function (clear) {
    if (clear) {
      textArr = []
      saveObj(textArr, textArrFileName)
      myLog('ok', 0)
    }
  })
})
ui.clearIds.on('click', () => {
  confirm('要清除id?', '', function (clear) {
    if (clear) {
      delFile(idsFileName)
      myLog('ok,请重新初始化', 0)
    }
  })
})

// -------------------------悬浮窗---------------------------
function startfloaty () {
  const runFloaty = floaty.window(
    <horizontal gravity='center'>
      <button id='stop'>始/停</button>
    </horizontal>
  )
  runFloaty.setPosition(w - 300, h - 200)
  runFloaty.stop.on('click', () => {
    let opera="开始";
    try {
      if ((mainThread === undefined || mainThread == null)) {
        myLog('正在执行任务，请不要操作，影响运行', 0)
        mainThread = threads.start(start)
      }else if (mainThread) {
        opera='停止'
        saveCache()
        mainThread.interrupt()
        myLog('已停止', 0)
        console.show()
      }
    } catch (e) {
      myLog(opera+'异常，重试或联系管理员')
    } finally {
      if(opera=='停止')mainThread = null
    }
  })
  // runFloaty.start.on('click', () => {
  //   try {
  //     if ((mainThread === undefined || mainThread == null)) {
  //       myLog('正在执行任务，请不要操作，影响运行', 0)
  //       mainThread = threads.start(start)
  //     } else {
  //       myLog('任务已在运行中，请不要重新运行', 0)
  //     }
  //   } catch (error) {
  //     myLog('运行错误，请重新运行，或联系管理员')
  //   }
  // })
  return runFloaty
}
// -----------------------------------------------------微信函数--------------------------------------------------------------
function start () {
  auto.waitFor('normal')
  myLaunchPackage(myPackageName)
  console.hide()
  if (!loadCache()) {
    myLog('请先进行初始化', 0)
    return
  }
  if (curRunFloaty === null)curRunFloaty = startfloaty()
  myLog(parameters.go)
  while (parameters.go-- > 0) {
    findNewMsg()
    reply()
    sleep(1000 * parameters.factor)
    if (parameters.go % parameters.saveInterval == 0)saveCache()
  }
  // Text = "";
  // while (true) {
  //     var UIOB = className("android.widget.AbsListView").findOne();
  //     if (getEnd(UIOB)!=""&&getEnd(UIOB)!= Text) {
  //         Text = getEnd(UIOB);
  //         log(Text);
  //         var txt=TuringRobot(Text);
  //         input(txt);
  //         while(!click("发送"));
  //     };
  // };
}

function clearCache () {
  delFile(userFileName)
  delFile(ignoreUserFileName)
  delFile(textArrFileName)
  delFile(parametersFileName)
  delFile(idsFileName)
  delFile(textArrGroupFileName)
}

function saveCache () {
  myLog(user)
  myLog(ignoreUser)
  myLog(textArr)
  myLog(parameters)
  myLog(ids)
  myLog(textArrNames)
  saveMap(user, userFileName)
  saveMap(ignoreUser, ignoreUserFileName)
  saveObj(textArr, textArrFileName)
  saveMap(parameters, parametersFileName)
  saveMap(ids, idsFileName)
  saveObj(textArrNames, textArrGroupFileName)
}

function loadCache () {
  user = loadObj(userFileName)
  ignoreUser = loadObj(ignoreUserFileName)
  myLog(textArrFileName)
  textArr = loadObj(textArrFileName)
  parameters = loadObj(parametersFileName)
  ids = loadObj(idsFileName)
  textArrNames = loadObj(textArrGroupFileName)
  if (user == null || ignoreUser == null || textArr == null || parameters == null || ids == null || textArrNames == null) return false
  myLog(user)
  myLog(ignoreUser)
  myLog(textArr)
  myLog(parameters)
  myLog(ids)
  myLog(textArrNames)
  allMsgView = id(ids.allMsgViewId)
  weixinView = id(ids.weixinViewId)
  newMsgView = id(ids.newMsgViewId)
  itemView = id(ids.itemViewId)
  userNameView = id(ids.userNameViewId)
  textSoundView = id(ids.textSoundViewId)
  return true
}

function findNewMsg () {
  let weixin = findView1(weixinView)
  if (weixin == null) throw WXNotAtIndex
  myLog('等待新消息到来')
  allMsgView.waitFor()
  myLog('发现消息')
  sleep(1000 * parameters.factor)
  let newMsg = findView1(newMsgView)
  while (newMsg == null || newMsg.bounds().height()<5) {
    if (!doubleClick(weixin)) throw DoubleClickFail
    sleep(1000 * parameters.factor)
    newMsg = findView1(newMsgView)
  }
  myLog(newMsg)
  sleep(1000 * parameters.factor)
  let clickView = newMsg.parent().parent()
  myClick(clickView)// 进入对话页
  sleep(1500 * parameters.factor)
}

function reply () {
  // 获取用户名和语音文件切换按钮
  let name = findView1(userNameView)
  let textSound = findView1(textSoundView)
  if (name == null || textSound == null) {
    myLog('页面不正确，退出对话', 1)
    let weixin = findView1(weixinView)
    if (weixin == null) myBack()
    sleep(1000 * parameters.factor)
    return false
  }
  name = name.text()
  myLog('用户为：' + name)
  if (ignoreUser[name] !== undefined && ignoreUser[name] === true) {
    myLog('用户为忽略用户，退出对话继续下位用户')
    myBack()
    sleep(1000 * parameters.factor)
    return false
  }
  if (textSound.text() == '切换到键盘' || textSound.desc() == '切换到键盘') {
    if (!myClick(textSound)) {
      myLog('语音切换到文字输入失败，退出')
      myBack()
      sleep(1000 * parameters.factor)
      return false
    }
    sleep(1000 * parameters.factor)
  }
  if (user[name] === undefined)user[name] = 0
  if (user[name] == textArr.length) {
    if (parameters.msgRecurse !== 0) {
      user[name] = 0
    } else {
      myBack()
      sleep(1000 * parameters.factor)
      return false
    }
  }
  const replyTxt = textArr[user[name]].val
  if (!input(replyTxt)) {
    sleep(1000 * parameters.factor)
    if (!setText(replyTxt)) {
      myLog('文字输入失败，退出')
      myBack()
      sleep(1000 * parameters.factor)
      return false
    }
  }
  myLog('输入文字为：' + replyTxt)
  let writeTime = replyTxt.length * parameters.aWordWrireTime
  writeTime = writeTime > 1000 ? writeTime : 1000
  sleep(writeTime * parameters.factor)
  let tryAgain = 3
  while (!click('发送') && tryAgain-- > 0) {
    myLog('发送失败，剩余重试次数：' + tryAgain)
    sleep(1000 * parameters.factor)
  }
  if (tryAgain >= 0) {
    user[name] = user[name] + 1
    myLog('发送成功')
  }
  myBack()
  sleep(1000 * parameters.factor)
}

function initData () {
  if (loadObj(idsFileName) == null) {
    if (!initIds()) return false
    saveMap(ids, idsFileName)
  }
  if (loadObj(ignoreUserFileName) == null) {
    saveMap(ignoreUser, ignoreUserFileName)
  }
  if (loadObj(userFileName) == null) {
    saveMap(user, userFileName)
  }
  if (loadObj(textArrFileName) == null) {
    saveObj(textArr, textArrFileName)
  }
  if (loadObj(parametersFileName) == null) {
    saveMap(parameters, parametersFileName)
  }
  if (loadObj(textArrGroupFileName) == null) {
    saveObj(textArrNames, textArrGroupFileName)
  }
  myLog('初始化已完成', 0)
  return true
}

function initIds () {
  auto.waitFor('normal')
  myLog('开始初始化,请确保当前在微信主页', 0)
  myLaunchPackage(myPackageName)
  if (!doAction1(initIndexView)) {
    myLog('初始化失败，请确保微信在主页且第一条为客户新消息后重试', 0)
    return false
  }
  return true
  // initUserView迁移到initIndexView内部完成
}

function initIndexView () {
  const tempFloaty = floaty.window(
    <horizontal gravity='center'>
      <button id='start'>位置</button>
    </horizontal>
  )
  tempFloaty.setPosition(w*0.24,  h*0.93)
  sleep(2000);
  floaty.closeAll()
  let allMsg = className('android.widget.TextView')
  // let allMsg = className('android.widget.TextView').depth(13)
  allMsg = findByRatio(allMsg, 0, 0.24, 0.93, 1)
  // myLog(allMsg.bounds())
  if (allMsg == null || allMsg.text() == '微信' || parseFloat(allMsg.text()).toString() == "NaN") {
    myLog('初始化失败，请确保有新消息到来才可以初始化'+allMsg.text(), 0)
    return
  }
  // 初始化全局消息id
  ids.allMsgViewId = allMsg.id()
  ids.weixinViewId = allMsg.parent().parent().id()
  // 双击跳到到有消息处
  //doubleClick(allMsg)
  sleep(1000 * parameters.factor)
  // 搜索消息
  let temp = className('android.view.ViewGroup')
  temp = temp.find()[1].bounds().bottom
  if(temp>h*0.2)temp=200;
  myLog(temp)
  let msgList = className('android.widget.ListView')
  let listArr = findViewArr(msgList)
  msgList=null;
  for(let i = 0;i<listArr.length;i++){
    let temp1 = listArr[i];
    if(temp1.bounds().width()>3 && temp1.bounds().height()>3){
      msgList=temp1;
      break;
    }
  }
  if(msgList==null)return false;
  let suc=false;
  // myLog(msgList.child(0).bounds())//微信标题栏
  // myLog(msgList.childCount())
  myLog(msgList.childCount())
  for (let i = 1; i < msgList.childCount(); i++) {
    let curView = msgList.child(i)
    myLog(curView.bounds())
    if (curView.childCount() == 0 || curView.bounds().height() < 3 || curView.bounds().top < temp) continue
    let leftView = curView.child(0)
    if (leftView.childCount() == 1) continue

    ids.itemViewId = curView.id()
    ids.newMsgViewId = leftView.child(1).id()
    // myLog("id查找成功："+ids.newMsgViewId);
    // findAndShow(id(ids.newMsgViewId));
    myLog(ids.itemViewId + ',' + ids.allMsgViewId + ',' + ids.newMsgViewId + ',' + ids.weixinViewId)
    // ----------------进入对话页初始化-------------------
    if (!myClick(curView)) throw clickFail
    sleep(1000 * parameters.factor)
    initUserView()
    suc=true;
    break
  }
  // doAction1(findAndShow,id(ids.allMsgViewId));
  // doAction1(findAndShow,id(ids.weixinViewId));
  // doAction1(findAndShow,id(ids.newMsgViewId));
  // doAction1(findAndShow,id(ids.itemViewId));
  myBack()
  return suc
}

function initUserView () {
  let nameView = className('android.widget.TextView')
  nameView = findView1(nameView)
  let textSound = className('android.widget.ImageButton')
  textSound = findView1(textSound)
  if (nameView == null || textSound == null) throw WXNotAtDialog

  ids.userNameViewId = nameView.id()
  ids.textSoundViewId = textSound.id()

  myLog(ids.userNameViewId + ',' + ids.textSoundViewId)
  // doAction1(findAndShow,id(ids.userNameViewId));
  // doAction1(findAndShow,id(ids.textSoundViewId));
  return true
}

// function getEnd(UiObject) {
//     try{
//         var sum = UiObject.childCount();
//         if (sum) {
//             var Object = UiObject.child(sum - 1);
//             if (Object.className() == "android.widget.TextView") {
//                 return Object.text();
//             } else {
//                 return getEnd(Object);
//             };
//         }else{return ""};
//     }catch(e){
//         return "";
//     };
// };

// ----------------------------------下为通用函数-----------------------------------------------
// -----------操作系列---------------

function myLaunchPackage (myPackageName) {
  if (currentPackage() !== myPackageName) {
    app.launchPackage(myPackageName)
    sleep(parameters.launchTime)
  }
}

function scrollFindAndClick (listView, view, heighError) {
  let time = 3
  let res = doAction1(findView, view)
  while (time-- > 0) {
    let operation = 'down'
    if (res != null)operation = canOperation(res, heighError)
    if (operation == 'ok') break
    findAndScroll(listView, operation)
    sleep(1001)
    res = doAction1(findView, view)
  }
  if (res == null) throw controlNotFoud
  if (!doAction1(myClick, res)) throw clickFail
  return true
}

function canOperation (view, error1, error2) {
  if (error1 === undefined)error1 = 4
  if (error2 === undefined)error2 = 4
  let rect = view.bounds()
  myLog(rect)
  if (rect.centerY() + error1 >= device.height) {
    return 'down'
  }
  if (rect.centerY() - error1 <= 0) {
    return 'up'
  }
  if (rect.centerX() + error2 >= device.width) {
    return 'right'
  }
  if (rect.centerX() - error2 <= 0) {
    return 'left'
  }
  return 'ok'
}

function findByRatio (uiselecter, xLeft, xRight, yTop, yBottom) {
  // myLog(yTop*h)
  return findView1(uiselecter.boundsInside(xLeft * w, yTop * h, xRight * w, yBottom * h))
}

function findArrAndShow (uiselecter) {
  let viewArr = doAction1(findViewArr, uiselecter)
  if (viewArr == null || viewArr.length == 0) throw controlNotFoud
  showViewArr(viewArr)
}

function showViewArr (viewArr) {
  myLog(viewArr.length)
  viewArr.forEach(element => {
    myLog(element.bounds())
  })
}

function findAndShow (uiselecter) {
  const view = doAction1(findView, uiselecter)
  if (view == null) throw controlNotFoud
  log(view)
}

function findAndClick (uiselecter) {
  const view = doAction1(findView, uiselecter)
  if (view == null) throw controlNotFoud
  if (!doAction1(myClick, view)) throw clickFail
  return true
}

function findAndScroll (uiselecter, direction) {
  const view = doAction1(findView, uiselecter)
  if (view == null) throw controlNotFoud
  if (!doAction1(scroll, view, direction)) throw controlCanNotScroll
  return true
}

function doubleClick (view, tryAgain) {
  if (tryAgain === undefined)tryAgain = 3
  const sleepTime = getDoubleClickInterval()
  myLog(sleepTime)
  const curRect = view.bounds()
  let x = curRect.centerX()
  let y = curRect.centerY()
  x = random(x - curRect.width() / 4, x + curRect.width() / 4)
  y = random(y - curRect.height() / 4, y + curRect.height() / 4)
  // myLog(curRect);
  // myLog("x="+x+",y="+y+",parameters.doubleClickAreaDeviation="+parameters.doubleClickAreaDeviation);
  while (tryAgain-- > 0) {
    if (randomClick(x, y, parameters.doubleClickAreaDeviation)) {
      sleep(sleepTime)
      if (randomClick(x, y, parameters.doubleClickAreaDeviation)) return true
    }
  }
  return false
}

function myBack (sleepTime, tryAgain) {
  if (sleepTime === undefined)sleepTime = 1001
  if (tryAgain === undefined)tryAgain = 3
  while (!back() && tryAgain-- > 0)sleep(800)
  sleep(sleepTime)
}

function myClick (view, tryAgain, type) {
  if (tryAgain === undefined)tryAgain = 3
  if (type !== undefined && view.clickable()) {
    while (tryAgain-- > 0) {
      if (view.click()) return true
    }
    return false
  }
  myLog('采用模拟屏幕点击')
  while (tryAgain-- > 0) {
    if (randomClickByRect(view.bounds())) return true
  }
  return false
}

function findView1 (uiselector, timeOut) {
  if (timeOut === undefined)timeOut = 5000
  return uiselector.findOne(timeOut)
}

function findView (uiselector, type) {
  const timeOut = 5000
  switch (type) {
    case 0:return uiselector.findOnce()
    case 1:return uiselector.findOne(timeOut)
    case 2:return uiselector.findOne()
    default:return uiselector.findOnce()
  }
}

function findViewArr (uiselector, type) {
  switch (type) {
    case 1:return uiselector.find()// 返回集合
    case 2:return uiselector.untilFind()// 返回集合
    default:return uiselector.find()
  }
}

function scroll (view, direction) {
  if (!view.scrollable) {
    throw controlCanNotScroll
  }
  switch (direction) {
    case 'down': view.scrollDown(); break
    case 'up': view.scrollUp(); break
    default: view.scrollDown()
  }
  return true
}

function myLog (str, type) {
  switch (type) {
    case 0: {
      toast(str)
      break
    }
  }
  log(str)
}
// ----------------------代理------------------------------
function doAction1 (action, arg0, arg1, arg2, arg3, arg4) {
  myLog('开始执行动作：' + getFnName(action))
  let res = null
  try {
    res = action(arg0, arg1, arg2, arg3, arg4)
    myLog('执行成功')
  } catch (error) {
    myLog('----执行失败：' + error)
  }
  myLog('结果类型：' + typeof res)
  return res
}

function doAction (action, arg0, arg1, arg2, arg3, arg4) {
  let str = '开始执行动作：' + getFnName(action) + ',参数为：'
  for (let i = 0; i < 5; i++) {
    const temp = eval('arg' + i)
    if (temp === undefined) break
    str += temp
    str += ','
  }
  myLog(str)
  let res = null
  try {
    res = action(arg0, arg1, arg2, arg3, arg4)
    myLog('执行成功')
  } catch (error) {
    myLog('----执行失败：' + error)
  }
  myLog('结果是：' + res)
  return res
}

function getFnName (callee) {
  let _callee = callee.toString().replace(/[\s\?]*/g, '')
  const comb = _callee.length >= 50 ? 50 : _callee.length
  _callee = _callee.substring(0, comb)
  let name = _callee.match(/^function([^\(]+?)\(/)
  if (name && name[1]) {
    return name[1]
  }
  const caller = callee.caller
  const _caller = caller.toString().replace(/[\s\?]*/g, '')
  const last = _caller.indexOf(_callee)
  const str = _caller.substring(last - 30, last)
  name = str.match(/var([^\=]+?)\=/)
  if (name && name[1]) {
    return name[1]
  }
  return 'anonymous'
}

// --------------随机系列-----------------

function getDoubleClickInterval () {
  let t1 = parameters.doubleClickInterval-parameters.doubleClickTimeDeviation;
  let t2 = parameters.doubleClickInterval+parameters.doubleClickTimeDeviation;
  myLog(t1 + ',' + t2)
  return random(t1, t2)
}

function getRandom (time, deviation) {
  let t1 = (time - deviation);
  let t2 = (time + deviation);
  return random(t1, t2)
}

function randomClick (x, y, deviation, deviationTmp) {
  if (deviationTmp === undefined)deviationTmp = deviation
  const xx = getRandom(x, deviation)
  const yy = getRandom(y, deviationTmp)
  myLog('随机点击信息：' + xx + ',' + yy)
  return click(xx, yy)
}

// 在框内随机点击,以后改成中心多四周少
function randomClickByRect (rect) {
  let deviation = rect.height() > rect.width() ? rect.width() : rect.height()
  deviation = random(0, deviation) / 2
  return randomClick(rect.centerX(), rect.centerY(), deviation)
}

// 仿真随机带曲线滑动
// qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
function swipeEx (qx, qy, zx, zy, time) {
  const xxy = [time]
  const point = []
  const dx0 = {
    x: qx,
    y: qy
  }
  const dx1 = {
    x: random(qx - 100, qx + 100),
    y: random(qy, qy + 50)
  }
  const dx2 = {
    x: random(zx - 100, zx + 100),
    y: random(zy, zy + 50)
  }
  const dx3 = {
    x: zx,
    y: zy
  }
  for (let i = 0; i < 4; i++) {
    point.push(dx0, dx1, dx2, dx3)
  };
  for (let i = 0; i < 1; i += 0.08) {
    const xxyy = [parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)]
    xxy.push(xxyy)
  }
  gesture.apply(null, xxy)
};

function bezierCurves (cp, t) {
  const cx = 3.0 * (cp[1].x - cp[0].x)
  const bx = 3.0 * (cp[2].x - cp[1].x) - cx
  const ax = cp[3].x - cp[0].x - cx - bx
  const cy = 3.0 * (cp[1].y - cp[0].y)
  const by = 3.0 * (cp[2].y - cp[1].y) - cy
  const ay = cp[3].y - cp[0].y - cy - by
  const tSquared = t * t
  const tCubed = tSquared * t
  const result = {
    x: 0,
    y: 0
  }
  result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x
  result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y
  return result
};

// 文件操作系列
function saveObj (obj, fileName) {
  files.createWithDirs(filePath + fileName)
  const str = JSON.stringify(obj)
  files.write(filePath + fileName, str)
  return true
}

function saveMap (map, fileName) {
  files.createWithDirs(filePath + fileName)
  const str = JSON.stringify(mapToObj(map))
  files.write(filePath + fileName, str)
  return true
}

function mapToObj (strMap) {
  const obj = Object.create(null)
  for (let key in strMap) {
    obj[key] = strMap[key]
  }
  return obj
}

function loadObj (fileName) {
  if (!files.exists(filePath + fileName)) {
    return null
  }
  const str = files.read(filePath + fileName)
  return JSON.parse(str)
}

function delFile (fileName) {
  return files.remove(filePath + fileName)
}
