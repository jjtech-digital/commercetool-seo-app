import { PrimaryButton } from "@commercetools-frontend/ui-kit"

const ActionRenderButtons = ({handleGenerate, handleApply, allProps}) => {
  return (
    <div style={{ display: 'flex' }}>
    <div>
      <PrimaryButton
        size="medium"
        label="Generate"
        onClick={() => handleGenerate(allProps)}
        isDisabled={false}
      />
    </div>
    <div style={{ marginInline: '6px' }}>
      <PrimaryButton
        size="medium"
        label="Apply"
        onClick={() => handleApply(allProps.rowIndex)}
        isDisabled={false}
      />
    </div>
  </div>
  )
}

export default ActionRenderButtons