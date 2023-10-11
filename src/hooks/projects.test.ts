import { act } from "react-dom/test-utils";

import { renderHookWithProviders, ExtendedRenderOptions } from "#/utils";
import { $projects, $loggedInState } from "#/mock";
import { projectsDB, storageDB } from "@/lib/storage";
import { useProjects } from "./projects";

const options: ExtendedRenderOptions = {
    preloadedState: $loggedInState,
};

describe(useProjects, () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mock("@codesandbox/sandpack-react", () => ({
            SANDBOX_TEMPLATES: { "vite-react": { files: [] } },
        }));
        vi.mock("@/lib/storage", () => ({
            projectsDB: {
                getAll: vi.fn(),
                create: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
            },
            storageDB: {
                rename: vi.fn(),
                delete: vi.fn(),
                download: vi.fn(),
            },
            foldersDB: {
                getAll: vi.fn().mockResolvedValue([]),
                delete: vi.fn(),
            },
            filesDB: {
                getAll: vi.fn().mockResolvedValue([]),
                delete: vi.fn(),
            },
        }));
    });

    it("should return an initial state", () => {
        vi.mocked(projectsDB.getAll).mockResolvedValue([]);
        const { result } = renderHookWithProviders(useProjects, options);
        expect(result.current.currentProject).toBe(null);
    });

    it.each([
        { projectId: "1", expected: true },
        { projectId: "random-id", expected: false },
    ])(
        "[isProjectOfUser] Project $projectId belongs to the user: $expected",
        async ({ projectId, expected }) => {
            vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
            const { result } = renderHookWithProviders(useProjects, options);
            /** Load all projects */
            await act(result.current.getAll);
            /** */
            const hasProject = await act(() =>
                result.current.isProjectOfUser(projectId)
            );
            expect(hasProject).toBe(expected);
        }
    );

    it.each([
        { name: "Sample React", expected: true },
        { name: "random-project", expected: false },
    ])(
        "[isProjectPresent] Project $name already exists: $expected",
        async ({ name, expected }) => {
            vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
            const { result } = renderHookWithProviders(
                useProjects,

                options
            );
            /** Load all projects */
            await act(result.current.getAll);
            /** */
            const isPresent = await act(() =>
                result.current.isProjectPresent(name)
            );
            expect(isPresent).toBe(expected);
        }
    );

    it.each([
        { projectId: "1", name: "Sample React", expected: true },
        { projectId: "1", name: "Sample React!", expected: false },
        { projectId: "random-id", name: "Random Project", expected: false },
    ])(
        "[isProjectMatch] Project $name with id $projectId belongs to the user: $expected",
        async ({ projectId, name, expected }) => {
            vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
            const { result } = renderHookWithProviders(useProjects, options);
            /** Load all projects */
            await act(result.current.getAll);
            /** */
            const isMatched = await act(() =>
                result.current.isProjectMatch(name, projectId)
            );
            expect(isMatched).toBe(expected);
        }
    );

    it("[getAll] should get sample projects", async () => {
        vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
        const { result } = renderHookWithProviders(useProjects, options);
        await act(result.current.getAll);
        expect(result.current.projects.length).toBe($projects.state.length);
    });

    it("[getById] should get correct project by ID or return undefined", async () => {
        const projects = $projects.state;
        vi.mocked(projectsDB.getAll).mockResolvedValue(projects);
        const { result } = renderHookWithProviders(useProjects, options);
        /** Load all projects */
        await act(result.current.getAll);
        /** Get extisted project */
        const project1 = await act(() =>
            result.current.getById(projects[0].projectId)
        );
        expect(project1).toEqual(projects[0]);
        /** Get unextisted project */
        const project2 = await act(() => result.current.getById("random-id"));
        expect(project2).toBeUndefined();
    });

    it("[select/reset] should act on `currentProject` correctly", async () => {
        vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
        const { result } = renderHookWithProviders(useProjects, options);
        /** Get all projects */
        await act(result.current.getAll);
        expect(result.current.currentProject).toBeNull();
        /** Select a project */
        const [id, action] = ["1", "demo"] as const;
        await act(() => result.current.select("1", "demo"));
        expect(result.current.currentProject).toEqual({ id, action });
        /** Reset `currentProject` to null */
        await act(result.current.reset);
        expect(result.current.currentProject).toBeNull();
    });

    it("[create/rename] should create a new project, then rename it correctly", async () => {
        const project1 = $projects.one.state;
        const project2 = { ...project1, name: `${project1.name}-rename` };
        vi.mocked(projectsDB.getAll).mockResolvedValue([]);
        vi.mocked(projectsDB.create).mockResolvedValue(project1);
        vi.mocked(projectsDB.update).mockResolvedValue(project2);

        const { result } = renderHookWithProviders(useProjects, options);
        /** No created projects */
        expect(projectsDB.getAll).toHaveBeenCalledTimes(1);
        expect(result.current.projects.length).toBe(0);
        /** Create a project
         * @todo check thunk: configureTemplateAsync
         * @todo check thunk: createParentFolders
         */
        await act(() =>
            result.current.create(project1.name, project1.template)
        );
        expect(result.current.projects.length).toBe(1);
        expect(result.current.projects[0]).toEqual(project1);
        /** Rename the project */
        await act(() =>
            result.current.rename(project1.projectId, project2.name)
        );
        expect(result.current.projects[0]).toEqual(project2);
    });

    it("[deleteMany] should delete projects by IDs", async () => {
        vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
        const { result } = renderHookWithProviders(useProjects, options);
        /** Get all (3) projects */
        await act(result.current.getAll);
        expect(result.current.currentProject).toBeNull();
        /** Delete 2 projects */
        await act(() => result.current.deleteMany(["1", "2"]));
        expect(projectsDB.delete).toHaveBeenCalledTimes(1);
        expect(result.current.projects.length).toBe(1);
    });

    /** @todo */
    it("[download] should download the entire project by ID", async () => {
        vi.mocked(projectsDB.getAll).mockResolvedValue($projects.state);
        const { result } = renderHookWithProviders(useProjects, options);
        /** Get all projects */
        await act(result.current.getAll);
        /** Download a project */
        const { projectId, name } = $projects.one.state;
        await act(() => result.current.download(projectId));
        expect(storageDB.download).toHaveBeenCalledTimes(1);
        expect(storageDB.download).toHaveBeenCalledWith(`${name}-${projectId}`);
    });
});
