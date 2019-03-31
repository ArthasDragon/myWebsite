import "braft-editor/dist/index.css";
import "braft-extensions/dist/table.css";
import "braft-extensions/dist/code-highlighter.css";

import CKEditor from "ckeditor4-react";

import { OssUpload } from "@alipay/aboss-common";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Skeleton,
  Spin
} from "@alipay/bigfish/antd";
import React, { Component } from "@alipay/bigfish/react";
import { connect } from "@alipay/bigfish/sdk";
import {
  BraftEditorMediaWrapper,
  CommonLabelSelect,
  EasyEditItem
} from "@alipay/yunge-common";
import { FormComponentProps } from "antd/lib/form";
import BraftEditor, { ControlType } from "braft-editor";
import Table from "braft-extensions/dist/table";
import CodeHighlighter from "braft-extensions/dist/code-highlighter";
import Markdown from "braft-extensions/dist/markdown";

import { AttachmentRefTypeEnum } from "~/component/constants/attachment";
import { CommonLabelTypeEnum } from "~/component/constants/label";
import { BaseDvaProps } from "~/component/models/common";
import { AbilityModel } from "~/model/abilityModel";
import { PlanTaskModel } from "~/model/planTaskModel";
import { AttachmentService } from "~/service/attachment";
import { updatePlanTask, UpdatePlanTaskRequest } from "~/service/planTask";
import { convertAttachmentsToInitFiles } from "~/util/attachment";
import { convertAbossTimestamp } from "~/util/common";
import { TASK_CONTROLS } from "~/util/editor";
import { OSS_META_CODE, Utils } from "~/util/utils";

const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: false, // 插入表格前是否弹出下拉菜单
  includeEditors: ["editor-with-table"] // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
};

BraftEditor.use(Table(options));
BraftEditor.use(
  CodeHighlighter({
    includeEditors: ["editor-with-table"]
  })
);
BraftEditor.use(
  Markdown({
    includeEditors: ["editor-with-table"]
  })
);

interface PlanTaskEditDrawerProps {
  visible: boolean;
  closeDrawer: () => any;
  planTaskId: number;
  planTask?: PlanTaskModel; // 当前待编辑的任务
  onUpdatePlanTaskSuccess?: () => any; // 更新任务的后置回调
  abilities?: AbilityModel[];
  getAbilitiesLoading?: boolean;
  getPlanTaskLoading?: boolean;
  reloadPlanTaskLoading?: boolean;
}

interface PlanTaskEditDrawerState {
  editDescription: boolean;
}

/**
 * 编辑任务抽屉
 */
@connect(({ planTask, ability, loading }) => ({
  planTask: planTask.planTask,
  abilities: ability.abilities,
  getPlanTaskLoading: loading.effects["planTask/getPlanTaskById"],
  reloadPlanTaskLoading: loading.effects["planTask/reloadPlanTaskById"],
  getAbilitiesLoading: loading.effects["ability/getAllAbilities"]
}))
class PlanTaskEditDrawer extends Component<
  BaseDvaProps & PlanTaskEditDrawerProps & FormComponentProps,
  PlanTaskEditDrawerState
> {
  public state: PlanTaskEditDrawerState = {
    editDescription: false
  };

  public componentDidMount(): void {
    this.props.dispatch({
      type: "ability/getAllAbilities"
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<
      BaseDvaProps & PlanTaskEditDrawerProps & FormComponentProps
    >,
    prevState: Readonly<PlanTaskEditDrawerState>,
    snapshot?: any
  ): void {
    if (
      this.props.visible === true &&
      prevProps.visible === false &&
      this.props.planTaskId
    ) {
      this.getPlanTask();
    }
  }

  public render() {
    const {
      form,
      planTask,
      getPlanTaskLoading,
      reloadPlanTaskLoading
    } = this.props;
    const { editDescription } = this.state;
    const leftFormItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 }
    };
    const rightFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    return (
      <div>
        <Drawer
          title={"更新计划任务"}
          width={1200}
          placement="right"
          onClose={this.onClose}
          maskClosable={false}
          visible={this.props.visible}
          destroyOnClose={true}
          style={{
            height: "calc(100% - 55px)",
            overflow: "auto",
            paddingBottom: 53
          }}
        >
          <Skeleton active={true} loading={getPlanTaskLoading}>
            <Spin spinning={!!reloadPlanTaskLoading}>
              {!planTask ? null : (
                <Form layout={"horizontal"} hideRequiredMark={true}>
                  <Row>
                    <Col style={{ paddingRight: 16 }} span={15}>
                      <Form.Item
                        {...leftFormItemLayout}
                        style={{ marginBottom: 0 }}
                      >
                        {this.generatePlanTaskNameEditItem()}
                      </Form.Item>
                      <div style={{ marginBottom: 16 }}>
                        <span style={{ color: "var(--color-text1-2,#999)" }}>
                          <span>
                            {planTask.creator.realName}创建于
                            {convertAbossTimestamp(planTask.utcCreated)}
                          </span>
                          <span>
                            {planTask.editor &&
                              `，${
                                planTask.editor.realName
                              }最后更新于${convertAbossTimestamp(
                                planTask.utcModified
                              )}`}
                          </span>
                        </span>
                        <span style={{ marginLeft: 16 }}>
                          {editDescription ? (
                            <Button
                              onClick={this.onSaveDescription}
                              type={"primary"}
                            >
                              保存描述
                            </Button>
                          ) : (
                            <Button onClick={this.onEditDescription}>
                              编辑描述
                            </Button>
                          )}
                        </span>
                      </div>
                      <Form.Item {...leftFormItemLayout}>
                        {form.getFieldDecorator("description", {
                          initialValue: BraftEditor.createEditorState(
                            planTask.description
                          )
                        })(
                          <BraftEditorMediaWrapper metaDataCode={OSS_META_CODE}>
                            <CKEditor
                              config={{}}
                              data="<p>This is an example CKEditor 4 instance.</p>"
                            />

                            {/* <BraftEditor
                              id="editor-with-table"
                              className="my-editor"
                              readOnly={!editDescription}
                              controls={editDescription ? (TASK_CONTROLS as ControlType[]) : []}
                              placeholder="请输入任务描述"
                            /> */}
                          </BraftEditorMediaWrapper>
                        )}
                      </Form.Item>
                    </Col>
                    <Col
                      style={{
                        borderLeft: "1px solid var(--color-fill1-3,#ebecf0)",
                        paddingLeft: 16
                      }}
                      span={9}
                    >
                      <Form.Item {...rightFormItemLayout} label={"计划任务ID"}>
                        <span>{planTask.id}</span>
                      </Form.Item>
                      <Form.Item {...rightFormItemLayout} label="状态">
                        <span>{planTask.enabled ? "生效" : "失效"}</span>
                      </Form.Item>
                      <Form.Item {...rightFormItemLayout} label={"能力角色"}>
                        {form.getFieldDecorator("workerAbilityCodes", {
                          initialValue: [],
                          rules: [
                            { required: true, message: "能力角色不能为空" }
                          ]
                        })(this.generatePlanTaskAbilityEditItem())}
                      </Form.Item>

                      <Form.Item
                        {...rightFormItemLayout}
                        label={"计划任务类型"}
                      >
                        {this.generatePlanTaskTypeEditItem()}
                      </Form.Item>

                      <Form.Item {...rightFormItemLayout} label={"项目阶段"}>
                        {this.generatePlanTaskStageEditItem()}
                      </Form.Item>

                      <Form.Item {...rightFormItemLayout} label="基线人天">
                        {form.getFieldDecorator("workday", {
                          rules: [
                            { required: true, message: "基线人天不能为空" }
                          ]
                        })(this.generatePlanTaskWorkDayEditItem())}
                      </Form.Item>

                      <Form.Item {...rightFormItemLayout} label={"输入"}>
                        <OssUpload
                          passFileListToOnChange={true}
                          metadataCode={OSS_META_CODE}
                          initFiles={convertAttachmentsToInitFiles(
                            planTask.inputAttachments
                          )}
                          multiple={true}
                          maxSize={1024}
                          dragger={false}
                          onGetFile={info => {
                            this.onGetFile(
                              info,
                              AttachmentRefTypeEnum.PLAN_TASK_INPUT
                            );
                          }}
                        />
                      </Form.Item>

                      <Form.Item {...rightFormItemLayout} label={"输出"}>
                        <OssUpload
                          passFileListToOnChange={true}
                          metadataCode={OSS_META_CODE}
                          initFiles={convertAttachmentsToInitFiles(
                            planTask.outputAttachments
                          )}
                          multiple={true}
                          maxSize={1024}
                          dragger={false}
                          onGetFile={info => {
                            this.onGetFile(
                              info,
                              AttachmentRefTypeEnum.PLAN_TASK_OUTPUT
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
            </Spin>
          </Skeleton>
        </Drawer>
      </div>
    );
  }

  /**
   * 根据ID加载计划任务
   * @param isReload
   */
  private getPlanTask = (isReload: boolean = false) => {
    this.props.dispatch({
      type: isReload
        ? "planTask/reloadPlanTaskById"
        : "planTask/getPlanTaskById",
      payload: {
        id: this.props.planTaskId,
        convertOptions: {
          convertAttachment: true,
          convertAbilities: true,
          convertTaskType: true,
          convertProjectStage: true
        }
      }
    });
  };

  /**
   * 上传或者删除附件
   * @param info
   * @param type
   */
  private onGetFile = (info, type: AttachmentRefTypeEnum) => {
    const { planTask } = this.props;
    if (info.file.status === "done") {
      if (info.file.url) {
        AttachmentService.uploadAttachment({
          refId: planTask.id,
          refType: type,
          path: Utils.getUrlRelativePath(info.file.url),
          name: info.file.name
        }).then(response => {
          message.success(`${info.file.name} 上传成功`);
        });
      } else {
        message.error(`${info.file.name} 上传失败`);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 上传失败`);
    } else if (info.file.status === "removed") {
      AttachmentService.removeAttachment({
        refId: planTask.id,
        refType: type,
        path: Utils.getUrlRelativePath(info.file.url)
      }).then(response => {
        message.success(`${info.file.name} 文件删除成功`);
      });
    }
  };

  /**
   * 编辑描述
   */
  private onEditDescription = () => {
    this.setState({
      editDescription: true
    });
  };

  /**
   * 保存描述
   */
  private onSaveDescription = () => {
    const { form } = this.props;
    const description = form.getFieldValue("description");

    console.log(description.editor.getData());

    // this.onUpdatePlanTask({
    //   id: this.props.planTask.id,
    //   description: description ? description.toRAW(true) : '',
    // });

    // this.setState({
    //   editDescription: false,
    // });
  };

  /**
   * 抽屉关闭回调
   */
  private onClose = () => {
    if (this.props.closeDrawer) {
      this.props.closeDrawer();
    }
    // 因为Drawer只会销毁Drawer的子元素，但是Drawer自身的State是依然保存着，所以我们需要将State复原到一开始的状态
    // TODO
  };

  /**
   * 计划任务名称
   */
  private generatePlanTaskNameEditItem = () => {
    const { planTask } = this.props;
    const planTaskName = planTask && planTask.name;
    return (
      <EasyEditItem
        defaultValue={planTaskName}
        onChangeValueTransform={e => {
          return e.target.value;
        }}
        displayContent={<span style={{ fontSize: 16 }}>{planTaskName}</span>}
        editContent={
          <Input
            ref={input => input && input.focus()}
            style={{ fontSize: 16 }}
            size={"large"}
          />
        }
        onOk={value => {
          if (value) {
            this.onUpdatePlanTask({
              id: planTask.id,
              name: value
            });
          } else {
            message.error("计划任务名称不能为空");
          }
        }}
      />
    );
  };

  /**
   * 基线人天
   */
  private generatePlanTaskWorkDayEditItem = () => {
    const { planTask } = this.props;
    const planTaskWorkDay = planTask && planTask.workday;
    return (
      <EasyEditItem
        displayContent={
          planTaskWorkDay ? (
            <span>{`${planTaskWorkDay} 天`}</span>
          ) : (
            <span>{"无"}</span>
          )
        }
        defaultValue={planTaskWorkDay}
        onChangeValueTransform={value => value}
        editContent={<InputNumber min={1} style={{ width: 140 }} />}
        onOk={value => {
          if (value) {
            this.onUpdatePlanTask({
              id: planTask.id,
              workday: value
            });
          }
        }}
      />
    );
  };

  /**
   * 计划任务类型
   */
  private generatePlanTaskTypeEditItem = () => {
    const { planTask } = this.props;
    const planTaskTypeName =
      planTask && planTask.typeDetail && planTask.typeDetail.name;
    const taskTypeCode = planTask && planTask.type;
    return (
      <EasyEditItem<string>
        displayContent={
          planTaskTypeName ? planTaskTypeName : <span>{"<无>"}</span>
        }
        defaultValue={taskTypeCode}
        onChangeValueTransform={value => value}
        editContent={
          <CommonLabelSelect
            placeholder={"请选择任务类型"}
            type={CommonLabelTypeEnum.TASK_TYPE}
            isMulti={false}
            isInForm={false}
          />
        }
        onOk={value => {
          if (value) {
            this.onUpdatePlanTask({
              id: planTask.id,
              type: value
            });
          }
        }}
      />
    );
  };

  /**
   * 能力选择框
   */
  private getAbilitySelect = () => {
    const { abilities, getAbilitiesLoading } = this.props;
    return (
      <Select
        mode={"multiple"}
        loading={getAbilitiesLoading}
        style={{ width: 140 }}
      >
        {Array.isArray(abilities)
          ? abilities.map(ability => (
              <Select.Option key={ability.code} value={ability.code}>
                {ability.name}
              </Select.Option>
            ))
          : null}
      </Select>
    );
  };

  /**
   * 能力角色
   */
  private generatePlanTaskAbilityEditItem = () => {
    const { planTask } = this.props;
    const planTaskAbilities = planTask.workerAbilities;
    const planTaskAbilityCodes = planTaskAbilities
      ? planTaskAbilities.map(ability => ability.code)
      : [];
    return (
      <EasyEditItem<string[]>
        displayContent={
          Array.isArray(planTaskAbilities) && planTaskAbilities.length > 0 ? (
            <span style={{ whiteSpace: "normal" }}>
              {planTaskAbilities.map(ability => ability.name).join("，")}
            </span>
          ) : (
            <span>{"<无>"}</span>
          )
        }
        defaultValue={planTaskAbilityCodes}
        onChangeValueTransform={value => value}
        editContent={this.getAbilitySelect()}
        onOk={value => {
          if (Array.isArray(value) && value.length > 0) {
            this.onUpdatePlanTask({
              id: planTask.id,
              workerAbilityCodes: value
            });
          }
        }}
      />
    );
  };

  /**
   * 项目阶段
   */
  private generatePlanTaskStageEditItem = () => {
    const { planTask } = this.props;
    const projectStageName =
      planTask &&
      planTask.projectStageDetail &&
      planTask.projectStageDetail.name;
    const projectStage = planTask && planTask.projectStage;
    return (
      <EasyEditItem<string>
        displayContent={
          projectStageName ? projectStageName : <span>{"<无>"}</span>
        }
        defaultValue={projectStage}
        onChangeValueTransform={value => value}
        editContent={
          <CommonLabelSelect
            defaultValue={projectStage}
            type={CommonLabelTypeEnum.PROJECT_STAGE}
            isMulti={false}
            isInForm={false}
          />
        }
        onOk={value => {
          if (value) {
            this.onUpdatePlanTask({
              id: planTask.id,
              projectStage: value
            });
          }
        }}
      />
    );
  };

  /**
   * 更新计划任务
   * @param newPlanTask
   */
  private onUpdatePlanTask = async (newPlanTask: Partial<PlanTaskModel>) => {
    const { onUpdatePlanTaskSuccess } = this.props;

    const updatePlanTaskRequest: Partial<
      UpdatePlanTaskRequest & PlanTaskModel
    > = {
      ...newPlanTask
    };

    updatePlanTask(updatePlanTaskRequest as UpdatePlanTaskRequest).then(
      response => {
        if (response.success) {
          message.success("更新成功");
          // 重新加载计划任务
          this.getPlanTask(true);

          if (onUpdatePlanTaskSuccess) {
            onUpdatePlanTaskSuccess();
          }
        } else {
          message.error("更新失败");
        }
      }
    );
  };
}

export default Form.create()(PlanTaskEditDrawer);
