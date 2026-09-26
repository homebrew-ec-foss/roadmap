import sys
import os

def patch_anna(anna_dir):
    parser_path = os.path.join(anna_dir, "pkg/parser/parser.go")

    if not os.path.exists(parser_path):
        print(f"Error: {parser_path} not found")
        sys.exit(1)

    with open(parser_path, "r") as f:
        src = f.read()

    # 1. Add import alongside goldmark-figure
    if 'alertcallouts "github.com/zmtcreative/gm-alert-callouts"' not in src:
        src = src.replace(
            'figure "github.com/mangoumbrella/goldmark-figure"',
            'figure "github.com/mangoumbrella/goldmark-figure"\n\talertcallouts "github.com/zmtcreative/gm-alert-callouts"'
        )

    # 2. Inject into TOC branch (contains &toc.Extender)
    # We use strings that match the source exactly
    src = src.replace(
        "\t\t\tgoldmark.WithExtensions(\n\t\t\t\textension.TaskList,\n\t\t\t\tfigure.Figure,\n\t\t\t\t&toc.Extender{",
        "\t\t\tgoldmark.WithExtensions(\n\t\t\t\textension.TaskList,\n\t\t\t\tfigure.Figure,\n\t\t\t\talertcallouts.AlertCallouts,\n\t\t\t\t&toc.Extender{"
    )

    # 3. Inject into non-TOC branch
    src = src.replace(
        "\t\t\tgoldmark.WithExtensions(\n\t\t\t\textension.TaskList,\n\t\t\t\tfigure.Figure,\n\t\t\t)",
        "\t\t\tgoldmark.WithExtensions(\n\t\t\t\textension.TaskList,\n\t\t\t\tfigure.Figure,\n\t\t\t\talertcallouts.AlertCallouts,\n\t\t\t)"
    )

    with open(parser_path, "w") as f:
        f.write(src)

    print("Patch applied. Verifying...")
    with open(parser_path, "r") as f:
        patched = f.read()

    count = patched.count("alertcallouts")
    print(f"Found {count} occurrences of 'alertcallouts' (expected 3: import + 2 usages)")

    if count != 3:
        print(f"Patch failed: found {count} occurrences instead of 3")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 patch_anna.py <anna_source_directory>")
        sys.exit(1)

    patch_anna(sys.argv[1])
