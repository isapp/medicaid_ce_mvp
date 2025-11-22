# Figma → React Component Mapping

| Figma Component      | React Component Path                      |
|----------------------|-------------------------------------------|
| Primary Button       | frontend/src/components/ui/Button.tsx     |
| Secondary Button     | frontend/src/components/ui/Button.tsx     |
| Text Input           | frontend/src/components/ui/Input.tsx      |
| Select / Dropdown    | frontend/src/components/ui/Select.tsx     |
| Card / Surface       | frontend/src/components/ui/Card.tsx       |
| Modal / Dialog       | frontend/src/components/ui/Modal.tsx      |
| Data Table           | frontend/src/components/ui/Table.tsx      |
| Toast / Alert        | frontend/src/components/ui/Toast.tsx      |

When implementing a new screen from Figma:
1. Identify components in the design.
2. Map each to an existing React component.
3. Only create new primitives if there is no existing pattern.
